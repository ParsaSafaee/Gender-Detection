// Check if name has correct propertise
// It should only consist A-Z, a-z, space and have max length of 255 chars
function checkValid(name) {
    let sample = /^[A-Za-z ]{1,255}$/;
    return sample.test(name);
}

// Handling the submit event, saving necessary stuff in a dictionary, then asking them from https://api.genderize.io
document.getElementById('submit').onclick = function (e) {
    e.preventDefault();
	// Getting necessary stuff
    let input_form = document.getElementById('data');
    let gender_status = document.querySelector('#predicted-gender');
    let gender_percentage = document.querySelector('#predicted-percentage');
    let saved_gender = document.querySelector('#saved-gender');
    let read_data = new FormData(input_form);
    let input_data = {};
	// Building a dictionary
    for (const [key, value] of read_data) {
        input_data[key] = value;
    }
	// Checking if there is any saved gender
	if (localStorage.getItem(input_data['name']) != null){
		saved_gender.innerText = 'Previously saved : ' + localStorage.getItem(input_data['name']);
    }
	// When name is valid
    if (checkValid(input_data['name'])) {
		// Setting up a request and receiving the prediction
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                let respData = JSON.parse(xmlHttp.responseText) || {};
				// // When it can't predict
                if (respData['gender'] == null){
                    gender_status.innerText = '----';
                    gender_percentage.innerText = '----';
                    error('Couldn\'t predict gender ! :(');
				// When everything goes smooth
                } else {
                    gender_status.innerText = respData['gender'];
                    gender_percentage.innerText = respData['probability'];
					error('');
                }
            } 
        };
		// Asking for a prediction with GET and a query string
        xmlHttp.open('GET', 'https://api.genderize.io/?name=' + input_data['name'], true);
        xmlHttp.send();
    } 
	// When name isn't valid or there is no name at all
    else {
        if (input_data['name'].length == 0) {
            error('Enter a name ! :)');
        }
        else {
            error('Invalid name ! :(');
        }   
    }
};

// Saving the prediction or user entry for a given name
document.getElementById('save').onclick = function (e) {
    e.preventDefault();
    // Getting necessary stuff
    let input_form = document.getElementById('data');
    let predicted_gender = document.querySelector('#predicted-gender');
    let read_data = new FormData(input_form);
    let input_data = {};

    for (const [key, value] of read_data) {
        input_data[key] = value;
    }
	// When name is valid
    if (checkValid(input_data['name'])) {
        let saved_gender = document.querySelector('#saved-gender'); 
		// Saving with a user entry, user has chosen male
        if (input_data['gender'] == 'male') {
            localStorage.setItem(input_data['name'], 'Male');
            saved_gender.innerText = 'Saved : Male';
        } 
		// Saving with a user entry, user has chosen female
		else if (input_data['gender'] == 'female') {
			localStorage.setItem(input_data['name'], 'Female');
            saved_gender.innerText = 'Saved : Female';
		}
		// Saving with a prediction, which is male
		else if (predicted_gender.innerText == 'male') {
			saved_gender.innerText = 'Saved : Male';
			localStorage.setItem(input_data['name'], 'Male');
		} 
		// Saving with a prediction, which is female
		else if (predicted_gender.innerText == 'female') {
			saved_gender.innerText = 'Saved : Female';
			localStorage.setItem(input_data['name'], 'Female');
		}
		// When there is nothing to save
		else if (predicted_gender.innerText == '----') {
			saved_gender.innerText = localStorage.getItem(input_data['name']);
			error('There is no gender or prediction to save ! :|');
		}  
    } 
	// When name isn't valid or there is no name at all
    else {
        if (input_data['name'].length == 0) {
            error('Enter a name ! :)');
        }
        else {
            error('Invalid name ! :(');
        }   
    }
};

// Clearing a saved gender for a name
document.getElementById('clear').onclick = function (e) {
    e.preventDefault();
    let user_input_name = document.getElementById('name').value;
    let gender = localStorage.getItem(user_input_name);
    if(gender){
        localStorage.removeItem(user_input_name)
        let saved_gender = document.querySelector('#saved-gender');
        saved_gender.innerText = 'Saved answer cleared !'
    } 
    else{
        error("There is nothing to clear ! :|")
		
    }
};

// Handling errors
function error(message) {
    let error = document.querySelector('#error');
    error.innerText = message;
}