import axios from 'axios';

const BASE_URL = 'http://localhost:3003';

// Mesaj gönderme işlemini gerçekleştiren fonksiyon
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-message`, { message });
    return response.data;
  } catch (error) {
    throw error;
  }
};
