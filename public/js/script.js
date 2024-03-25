// Số lượng dữ liệu trước đó
var lastId = 0;
var count = 0;

// Đang lấy thêm user checkin
var isExecuting=false;
const API_URL='https://face.vnptlab.com';


// Function to fetch data from the API
async function startUp() {
    try {
        isExecuting=true;
        const response = await fetch(API_URL + '/checked-in');
        const results = await response.json();
       
        if( results.data.length >0) {
            lastId=results.data[results.data.length-1].id;
            renderData(results.data);
            
        }   
        addCounter(count); 
		isExecuting=false;		
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Function to render data in cards
function renderData(listUser) {
   
    isExecuting=true;
    const container = document.querySelector('.u-repeater');
    container.innerHTML = '';

    listUser.forEach(item => {
        addUserCard(item.id,'.u-repeater',item.avatar,item.fullName,item.organization);     
    });
    count = listUser.length;
    addCounter(count);
    isExecuting=false;
}

// Call the renderData function to display data
startUp();

async function newUserCheckedIn(){

    if(isExecuting)
        return;
    isExecuting=true;
     
    try {
        var response = await fetch(API_URL + '/checked-in-last/'+ lastId);
        var results = await response.json();
        //console.log('newUser==', results.data);
        
        if(results.data.length ==0){
            isExecuting=false;
            return;
        }

        var newUser=results.data[0];
   
        if(newUser.id > lastId){     
            console.log("running" + isExecuting);   
            addUserCard(newUser.id,'.u-repeater',newUser.avatar,newUser.fullName,newUser.organization);                
            //closePopup();
            openPopup(newUser);   
            var audio = new Audio(newUser.welcomeMp3);
			
            audio.play();
            count = count + 1;
            addCounter(count);
        }             

        lastId=newUser.id;
        
      

    } catch (error) {
        console.error('Error fetching data:', error);
        isExecuting=false;
    }
}



setInterval(newUserCheckedIn, 8000);

async function openPopup(user) {

    isExecuting=true;
    
    addUserPopup(user.avatar,user.fullName,user.organization);
    $('#modal-container').removeAttr('class').addClass("one");
    $('body').addClass('modal-active');

    //Set a timeout to close the popup after 15 seconds
    setTimeout(function() {
        closePopup();
        isExecuting=false;
    }, 8000);
     console.log("running" + isExecuting);   
   
}

// Function to close the popup
function closePopup() {
   $('#modal-container').addClass('out');
   $('body').removeClass('modal-active');
}




async function addUserCard(index,classStr,avatar,fullName,organization) {
    var container = document.querySelector(classStr);

    if (container) {
        const card = document.createElement('div');
        var classes = 'u-align-center u-container-align-center u-container-style u-list-item u-opacity u-opacity-90 u-repeater-item u-shape-rectangle';
        card.classList.add(...classes.split(' '));

        const card_detail = document.createElement('div');
        var classes_detail = 'u-container-layout u-similar-container u-valign-top u-container-layout-1';
        card_detail.classList.add(...classes_detail.split(' '));

        if (avatar !== "") {
            const img = document.createElement('img');
            var classes_img = 'u-border-7 u-border-palette-4-base u-image u-image-circle u-image-1 button';
            img.classList.add(...classes_img.split(' '));
            img.src = avatar;
            card_detail.appendChild(img);
            // Đóng thẻ
        }

        if (fullName !== "") {
            const title = document.createElement('h4');
            var classes_title = 'u-align-center u-text u-text-2';
            title.classList.add(...classes_title.split(' '));
            title.textContent = fullName;
            card_detail.appendChild(title);
        }

        if (organization !== "") {
            const body = document.createElement('p');
            var classes_body = 'u-align-center u-text u-text-3';
            body.classList.add(...classes_body.split(' '));
            body.textContent = organization;
            card_detail.appendChild(body);
        }
        
        card.appendChild(card_detail);

        container.insertBefore(card, container.firstChild);
        //container.appendChild(card);
    } else {
        console.error('Container not found:', class_Str);
    }
}



function addUserPopup(avatar,fullName,organization) {
    const nameElement = document.querySelector('.m_fullname');
    nameElement.textContent = fullName;

    const imgElement = document.querySelector('.image-checkin');
    imgElement.src = avatar;

    const organizationElement = document.querySelector('.m_organization');
    organizationElement.textContent = organization;

}
function addCounter(counter) {
    const contain = document.querySelector('.counter');
    contain.innerHTML = '';
    contain.textContent = counter;
}

