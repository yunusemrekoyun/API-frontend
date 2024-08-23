import axios from 'axios';

const API_BASE_URL = 'https://localhost:7023/api';


export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/UserList/all`);
    console.log("Userlist : ",response)
    return response.data;
  } catch (error) {
    console.error('Kullanıcıları alırken bir hata oluştu:', error);
    throw error;
  }
};


export const transferMoney = async (transferRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Transfer/transfer`, transferRequest);
    return response.data;
  } catch (error) {
    console.error('Para transferi sırasında bir hata oluştu:', error);
    throw error;
  }
};