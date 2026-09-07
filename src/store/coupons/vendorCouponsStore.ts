import { create } from 'zustand';
import couponApi from '../../services/api/couponSevice';
import useConfigStore from '../configStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCoupon(c: any): string {
  if (c.type === 'FREE_DELIVERY') {
    return c.mov && c.mov > 0 ? `Free delivery above ₹${c.mov}` : 'Free Delivery';
  }
  if (c.type === 'FIXED' && c.discountValue != null) {
    return `₹${c.discountValue} OFF`;
  }
  if (c.type === 'PERCENTAGE' && c.discountValue != null) {
    return `${c.discountValue}% OFF`;
  }
  return '';
}

interface VendorCouponsState {
  couponsByVendor: Record<string, string>;
  loading: boolean;
  fetchedVendors: Set<string>;
  fetchForVendors: (shopIds: string[], serviceType?: string) => Promise<void>;
  getBestCouponText: (shopId: string) => string | null;
  invalidateCache: () => void;
}

const useVendorCouponsStore = create<VendorCouponsState>((set, get) => ({
  couponsByVendor: {},
  loading: false,
  fetchedVendors: new Set(),

  fetchForVendors: async (shopIds: string[], serviceType = 'FOOD') => {
    const regionId = useConfigStore.getState().getRegionId();
    if (!regionId) return;

    const alreadyFetched = get().fetchedVendors;
    const toFetch = shopIds.filter(id => !alreadyFetched.has(id));
    if (toFetch.length === 0) return;

    set({ loading: true });

    const results = await Promise.allSettled(
      toFetch.map(shopId =>
        couponApi
          .getAvailableCoupons(regionId, shopId, serviceType)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then((coupons: any[]) => {
            if (!coupons || coupons.length === 0) return { shopId, label: '' };
            const label = formatCoupon(coupons[0]);
            return { shopId, label };
          })
          .catch(() => ({ shopId, label: '' }))
      )
    );

    const newCoupons: Record<string, string> = {};
    const newFetched = new Set(alreadyFetched);

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.label) {
        newCoupons[result.value.shopId] = result.value.label;
      }
      if (result.status === 'fulfilled') {
        newFetched.add(result.value.shopId);
      }
    }

    set(state => ({
      couponsByVendor: { ...state.couponsByVendor, ...newCoupons },
      fetchedVendors: newFetched,
      loading: false,
    }));
  },

  getBestCouponText: (shopId: string) => {
    return get().couponsByVendor[shopId] ?? null;
  },

  invalidateCache: () => {
    set({ couponsByVendor: {}, fetchedVendors: new Set(), loading: false });
  },
}));

export default useVendorCouponsStore;
