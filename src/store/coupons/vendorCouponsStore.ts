import { create } from 'zustand';
import axiosInstance, { apiCall, getAuthHeader } from '../../config/api/axios.config';
import useConfigStore from '../configStore';

interface RawCoupon {
  code: string;
  discountValue: number | null;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  uptoValue: number | null;
  mov: number | null;
  shopIds: string[] | null;
}

interface VendorCouponsState {
  /** shopId → formatted coupon label (e.g. "20% OFF") */
  couponsByVendor: Record<string, string>;
  /** Best platform-wide coupon label, applied to vendors with nothing vendor-specific */
  platformCouponText: string | null;
  loading: boolean;
  lastFetched: Record<string, number>;
  fetchCoupons: (serviceType?: string) => Promise<void>;
  getBestCouponText: (shopId: string) => string | null;
  invalidateCache: () => void;
}

const CACHE_TTL = 5 * 60 * 1000;

function formatCoupon(coupon: RawCoupon): string {
  switch (coupon.type) {
    case 'PERCENTAGE':
      return `${coupon.discountValue}% OFF`;
    case 'FIXED':
      return `₹${coupon.discountValue} OFF`;
    case 'FREE_DELIVERY':
      return 'Free Delivery';
    default:
      return '';
  }
}

const useVendorCouponsStore = create<VendorCouponsState>((set, get) => ({
  couponsByVendor: {},
  platformCouponText: null,
  loading: false,
  lastFetched: {},

  fetchCoupons: async (serviceType = 'FOOD') => {
    const now = Date.now();
    const last = get().lastFetched[serviceType] ?? 0;
    if (now - last < CACHE_TTL) return;

    const regionId = useConfigStore.getState().getRegionId();
    if (!regionId) return;

    set({ loading: true });
    try {
      const authHeader = getAuthHeader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await apiCall(
        axiosInstance.get('/v3/coupons/available', {
          params: { regionId, serviceType },
          headers: { Authorization: authHeader },
        })
      );

      const rawCoupons: RawCoupon[] = (data?.response?.data ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => ({
          code: c.code ?? '',
          discountValue: c.discountValue ?? 0,
          type: c.type ?? 'FIXED',
          uptoValue: c.uptoValue ?? null,
          mov: c.mov ?? 0,
          shopIds: c.shopIds,
        })
      );

      const byVendor: Record<string, string> = {};
      let platformBest: RawCoupon | null = null;

      for (const coupon of rawCoupons) {
        if (!coupon.shopIds || coupon.shopIds.length === 0) {
          if (!platformBest || (coupon.discountValue ?? 0) > (platformBest.discountValue ?? 0)) {
            platformBest = coupon;
          }
        } else {
          const text = formatCoupon(coupon);
          if (!text) continue;
          for (const shopId of coupon.shopIds) {
            if (!byVendor[shopId]) {
              byVendor[shopId] = text;
            }
          }
        }
      }

      set({
        couponsByVendor: byVendor,
        platformCouponText: platformBest ? formatCoupon(platformBest) : null,
        loading: false,
        lastFetched: { ...get().lastFetched, [serviceType]: now },
      });
    } catch (error) {
      console.warn('[vendorCouponsStore] Failed to fetch coupons:', error);
      set({ loading: false });
    }
  },

  getBestCouponText: (shopId: string) => {
    const { couponsByVendor, platformCouponText } = get();
    return couponsByVendor[shopId] ?? platformCouponText;
  },

  invalidateCache: () => {
    set({ lastFetched: {} });
  },
}));

export default useVendorCouponsStore;
