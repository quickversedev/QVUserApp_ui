import axiosInstance, { apiCall } from '../../config/api/axios.config';

export type AuthData = {
  session: {
    token: string;
    phoneNumber: string;
    newUser: boolean;
    name: string;
    email: string;
  };
};

const sendOtp = async (phoneNumber: string): Promise<any> => {
  //*********************mock****************
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({});
    }, 1000);
  });

  // return apiCall(
  //   axiosInstance.post('/v1/requestOtp', {
  //     mobile: phoneNumber,
  //   }, {
  //     headers: {
  //       Authorization: 'token',
  //     },
  //   })
  // ).then(data => data?.response?.verificationId);
};

const verifyOtp = async (
  phoneNumber: string,
  otp: string,
  verificationId: string
): Promise<AuthData> => {
  //   *********************mock****************
  console.log('response: Inside verify otp', otp, verificationId);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        session: {
          token: JWTTokenMock,
          phoneNumber: phoneNumber,
          name: 'Lucas Garcez',
          email: 'abhilashghope@gmail.com',
          newUser: true,
        },
      });
    }, 1000);
  });

  // let fcmToken = '';
  // return apiCall(
  //   axiosInstance.post('/v1/login', {
  //     mobile: phoneNumber,
  //     otp: otp,
  //     verificationId: verificationId,
  //     fcmToken: fcmToken,
  //   })
  // ).then(data => ({
  //   session: {
  //     token: data.session.jwt,
  //     phoneNumber: data.session.mobile,
  //     newUser: data.session.newUser,
  //     name: data.session.userName,
  //     email: data.session.email,
  //   },
  // }));
};

const signUp = async (
  fullName: string,
  dob: string,
  campusId: string,
  email: string
): Promise<any> => {
  return apiCall(
    axiosInstance.post(
      '/v1/registerUser',
      {
        birthdate: dob,
        campusId: campusId,
        emailId: email,
        userName: fullName,
      },
      {
        headers: {
          SessionKey: 'token',
        },
      }
    )
  );
};

const signOut = async (): Promise<any> => {
  return apiCall(
    axiosInstance.delete('/v1/logout', {
      headers: {
        SessionKey: 'token',
      },
    })
  );
};

const authService = {
  sendOtp,
  verifyOtp,
  signUp,
  signOut,
};

export default authService;

const JWTTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikx1Y2FzIEdhcmNleiIsImlhdCI6MTUxNjIzOTAyMn0.oK5FZPULfF-nfZmiumDGiufxf10Fe2KiGe9G5Njoa64';
