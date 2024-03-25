// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch('https://face.vnptlab.com/checked-in?gidzl=b3oQPcaQ0MkG8P9bRGG2RvCeaMLn2m8zYokGCNTS2pkDSSrXTbKAROvtoMnrLWXXZ7JFEcNC5Q8vQXq8QW');
        const data = await response.json();
         console.log('data==', data.data);
        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to render data in cards
async function renderData() {
    const container = document.querySelector('.container');
    const data = await fetchData();

    if (!data) {
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        const title = document.createElement('h2');
        title.textContent = item.fullName;

        const body = document.createElement('p');
        body.textContent = item.organization;

        card.appendChild(title);
        card.appendChild(body);
        container.appendChild(card);
    });
}

// Call the renderData function to display data
renderData();