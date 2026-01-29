import axiosInstance, { endpoints } from 'src/utils/axios';


export const submitClaim = async (claimData) => {
  const response = await axiosInstance.post(endpoints.clim.all, claimData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
