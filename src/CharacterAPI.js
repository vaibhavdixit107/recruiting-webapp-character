import axios from 'axios';

const API_BASE_URL = 'https://recruiting.verylongdomaintotestwith.ca/api';

const saveCharacter = async(userName, characterData) => {
    try {
        const response = await axios.post(
          `${API_BASE_URL}/${userName}/character`,
          characterData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data; // Return the response data 
      } catch (error) {
        throw error; // Handle errors
      }
              
}

const getCharacter = async (userName) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${userName}/character`
      );
      return response.data; // Return the response data 
    } catch (error) {
      throw error; // Handle errors
    }
  };
  
  export { saveCharacter, getCharacter };