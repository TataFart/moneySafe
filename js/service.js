const API_URL = 'https://indigo-foremost-octopus.glitch.me/api';


export const getData = async (url) => {
  try {
      const response = await fetch(`${API_URL}${url}`)
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error('Error In', error);
      throw error;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await fetch (`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data),
    })
    console.log('response : ', response );
    if(!response.ok){
      throw new Error(`HTTP error, status ${response.status}`)
    } 
    return await response.json();
  } catch (error) {
    console.error("ошибка при отправке данных", error);
    throw error;
  }
};

export const delData = async (url) => {
  try {
    const response = await fetch (`${API_URL}${url}`, {
      method: "DELETE",
     
    });
    console.log('response : ', response );
    if(!response.ok){
      throw new Error(`HTTP error, status ${response.status}`);
    } 
    return await response.json();
  } catch (error) {
    console.error("ошибка при !удалении данных", error);
    throw error;
  }
};