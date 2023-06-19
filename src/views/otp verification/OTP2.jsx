import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../../axios-client'
import Loader from '../../components/loader/Loader'
import { useStateContext } from '../../contexts/ContextProvider'
import ModalOTP from './ModalOTP'
import Spinner from '../../components/loader/Spinner' 
import Swal from 'sweetalert2'

export default function OTP2() {
    const [showModal, setShowModal] = useState(false);
    const [userID, setUserID] = useState();
    const [loading, setLoading] = useState(false);
    const [countDown, setCountDown] = useState(0);
    const [errors, setErrors] = useState();
    const [runTimer, setRunTimer] = useState(true);
    const seconds = String(countDown % 60).padStart(2, 0);
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);
    const location = useLocation();
    const navigate = useNavigate();
    const resendRef = useRef();
    const otpRefs = Array.from({ length: 6 }, () => useRef());
    const { setUser, setToken, setRole, setUser_ID } = useStateContext();
    const email = location.state?.email ?? null;

    const onKeyPress = (ev) => {
        if (!/[0-9]/.test(ev.key)) {
          ev.preventDefault();
        }
      };
    
      const onSubmit = async (ev) => {
        ev.preventDefault();
    
        const otpValue = otpRefs.map((ref) => ref.current.value).join('');
    
        const verification = {
          token: otpValue,
          email,
        };
    
        try {
          const { data } = await axiosClient.post('/verifyotp_forgotpwd', verification);
          setShowModal(true);
          setUserID(data.id);
        } catch (err) {
          const response = err.response;
    
          if (response?.status === 422) {
            const errors = response.data.errors || {
              email: [response.data.message],
            };
            setErrors(errors);
          }
        }
      };
    
      const onResend = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        resendRef.current.classList.add('isDisabled');
    
        const otpEmail = { email };
    
        try {
          const { data } = await axiosClient.post('/resendotp', otpEmail);
    
          if (data === 'blocked') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text:
                'Your account has been temporarily locked due to 3 consecutive request OTP attempts. Please try again in 60 minutes or contact your Corporate Manager.',
            }).then(() => {
              navigate('/');
            });
          } else {
            resendRef.current.classList.add('isDisabled');
            setRunTimer(true);
          }
    
          setLoading(false);
          setErrors('');
        } catch (error) {
          setLoading(false);
          setErrors(error.message);
        }
      };
    
      useEffect(() => {
        let timerId;
    
        if (runTimer) {
          setCountDown(60 * 3);
          timerId = setInterval(() => {
            setCountDown((countDown) => countDown - 1);
          }, 1000);
        } else {
          clearInterval(timerId);
        }
    
        return () => clearInterval(timerId);
      }, [runTimer]);
    
      useEffect(() => {
        if (countDown < 0 && runTimer) {
          resendRef.current.classList.remove('isDisabled');
          setRunTimer(false);
          setCountDown(0);
    
          const otpEmail = {
            email,
          };
    
          axiosClient.post('/expiredotp', otpEmail).then(({ data }) => {
            // Navigate('/dashboard')
            // console.log(data)
          });
        }
      }, [countDown, runTimer]);
      
  return (
    <div id="otp">
      <form className="form" onSubmit={onSubmit}>
        <span className="close">X</span>
        <div className="info">
          <span className="title">Email Verification</span>
          <p className="description">Please enter the code we have sent you.</p>
        </div>
        <div className="inputs">
          {otpRefs.map((ref, index) => (
            <input
              key={index}
              ref={ref}
              placeholder=""
              type="text"
              maxLength="1"
              onKeyPress={onKeyPress}
            />
          ))}
        </div>
        {errors && (
          <div className="otp_alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0] ?? ''}</p>
            ))}
          </div>
        )}
        <div className="timer">Time: {minutes}:{seconds}</div>
        <button className="validate">Verify</button>
        <div>
          <p className="resend">
            Did not receive email verification?
            <a ref={resendRef} onClick={onResend} className="resend-action isDisabled">
              send again
            </a>
          </p>
          {loading && <Spinner />}
        </div>
      </form>

      <ModalOTP show={showModal} close={() => setShowModal(false)} email={email} id={userID} />
    </div>
  )
}
