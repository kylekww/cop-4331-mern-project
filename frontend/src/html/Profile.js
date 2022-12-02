import { ListItemSecondaryAction } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import '../css/styles.css';
import EditProfile from './EditProfile';

function Profile() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const viewProfile = async event => {
            const data = await fetch("/api/v1/auth/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(res => {
                    res.json().then((data) => {
                        console.log(data);
                        setUser(data.user);
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        };
        viewProfile()
    }, [])

    const logOut = async event => {
        const data = await fetch("/api/v1/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => {
                window.location.href = '/';
            })
            .catch(err => {
                console.log(err);
            });
    };
    const returnLanding = async event => {
        window.location.href = '/landing';
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (

        <div>
            <div class="container">
                <img src={require('../images/NewIcon.jpg')} class="HushIcon"/>
                <div class="squarebg">
                    <h1>Profile View</h1>
                    <p id="profile">Name: {user.name}</p>
                    <p id="profile">Username: {user.username}</p>
                    <div id="buttons">
                        <button type="button" class="return" onClick={returnLanding}>Return</button>
                        <button type="button" class="logout" onClick={logOut}>Logout</button>
                        <button type="button" class="return" onClick={<EditProfile />}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default Profile;
