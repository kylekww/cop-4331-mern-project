import React, { useState, useEffect } from 'react';
import '../css/styles.css';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useParams } from "react-router-dom";

function NewPassword() {
    const token = useParams().token;

    function passwordRequirements(password) {
        let upperCase = false;
        let lowerCase = false;
        let passwordNumber = false;
        let passwordLength = false;

        if (password.length >= 8) {
            passwordLength = true;
        }

        for (let i = 0; i < password.length; i++) {
            if (password[i] >= "0" && password[i] <= "9") {
                passwordNumber = true;
            } else if (password[i].toUpperCase() === password[i]) {
                upperCase = true;
            } else if (password[i].toUpperCase() !== password[i]) {
                lowerCase = true;
            }
        }

        if (passwordLength && passwordNumber && upperCase && lowerCase) {
            return true;
        } else {
            return false;
        }
    }
    
    const doChangePassword = async event => {
        const password = document.getElementById("password").value;
        if(password == null) {
            alert("Input a new password");
            return;
        }
        else if(!passwordRequirements(password)) {
            alert("Invalid password");
            return;
        }

        const data = fetch('/api/v1/auth/passwordReset/' + token, {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password
            }),
        })
        .then(res => {
            if(res.status == 502) alert("Password reset failed");
            else {
                alert("Password has been changed!");
                window.location.href = '/';
            }
        })
        .catch(err => {
            console.log(err);
        })
    };

    return (
        <div class="container">
            <img src={require('../images/NewIcon.jpg')} class="HushIcon"/>
            <div class="squarebg">
                <h1>Create a New Password </h1>
                <input type="password" id="password" placeholder="Password" required />
                <span class="passwordRequirements">
                    Requirements: <br />
                    8 Characters <br />
                    1 Number <br />
                    1 Upper Case Character <br />
                    1 Lower Case Character <br />
                </span>
                <button type="button" class="button" onClick={doChangePassword}>Change password</button>
                <p>Nevermind? <a href="/">Login!</a></p>
            </div>
        </div>
    );
}

export default NewPassword;