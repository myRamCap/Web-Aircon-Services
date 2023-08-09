import React from 'react';
import ReactDOM from 'react-dom';  // Make sure to import ReactDOM
import Swal from 'sweetalert2';
import GoogleMaps from '../../components/googleMap/GoogleMaps';

export default function TestMaps() {
    const openMapPopup = () => {
        const googleMapURL = 'http://localhost:3000/map'; // Replace with your Google Maps URL

        Swal.fire({
            // html: `<iframe width="100vw" height="100vh" frameborder="0" style="border:0" src="${googleMapURL}" allowfullscreen></iframe>`,
            // html: `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${googleMapURL}" allowfullscreen></iframe>`,
            html: '<div id="iframeContainer" style="width: 100%; height: 100vh;"><iframe width="100%" height="100%" frameborder="0" style="border:0" src="' + googleMapURL + '" allowfullscreen></iframe></div>',
            showCloseButton: true,
            width: '100%',  // Set SweetAlert width to 100%
            heightAuto: false  // Disable automatic height adjustment
        });
    };

    return (
        <button onClick={openMapPopup}>Open Map</button>
    );
}
