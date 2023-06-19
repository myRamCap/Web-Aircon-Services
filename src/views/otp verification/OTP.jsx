import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import ModalOTP from './ModalOTP';
import Spinner from '../../components/loader/Spinner';
import Swal from 'sweetalert2';

export default function OTP() {
  const [showModal, setShowModal] = useState(false);
  const [userID, setUserID] = useState();
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [errors, setErrors] = useState();
  const [runTimer, setRunTimer] = useState(true);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const { setUser, setToken, setRole, setUser_ID } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email ?? null;

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const onKeyPress = (ev) => {
    if (!/[0-9]/.test(ev.key)) {
      ev.preventDefault();
    }
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const verification = {
      token: otp.join(''),
      email: email,
    };

    try {
      const { data } = await axiosClient.post('/verifyotp', verification);
      if (data.user) {
        setUser(data.user);
        setToken(data.token);
        setRole(data.role);
        setUser_ID(data.user_ID);
      } else {
        setShowModal(true);
        setUserID(data.id);
      }
    } catch (error) {
      const response = error.response;

      if (response.status === 422) {
        const errors = response.data.errors ? response.data.errors : { email: [response.data.message] };
        setErrors(errors);
      }
    }
  };

  const onResend = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    const otpEmail = {
      email: email,
    };

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
        setRunTimer(true);
      }
      setLoading(false);
      setErrors('');
    } catch (error) {
      // Handle error
      console.log(error);
      setLoading(false);
      setErrors('');
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
      setRunTimer(false);
      setCountDown(0);

      const otpEmail = {
        email: email,
      };

      axiosClient
        .post('/expiredotp', otpEmail)
        .then(({ data }) => {
        })
        .catch((error) => {
          // Handle error
          console.log(error);
        });
    }
  }, [countDown, runTimer]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div id="otp">
      <form className="form" onSubmit={onSubmit}>
        <span className="close">X</span>
        <div className="info">
          <span className="title">Email Verification</span>
          <p className="description">Please enter the code we have sent you.</p>
        </div>
        <div className="inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              value={digit}
              placeholder=""
              type="text"
              maxLength="1"
              onKeyPress={onKeyPress}
              onChange={(e) => handleOtpChange(index, e.target.value)}
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
        <div className="timer">Time: {String(Math.floor(countDown / 60)).padStart(2, 0)}:{String(countDown % 60).padStart(2, 0)}</div>
        <button className="validate">Verify</button>
        <div>
          <p className="resend">
            Did not receive email verification?
            <a onClick={onResend} className={`resend-action ${loading ? 'isDisabled' : ''}`}>
              send again
            </a>
          </p>
          {loading && <Spinner />}
        </div>
      </form>

      <ModalOTP show={showModal} close={() => setShowModal(false)} email={email} id={userID} />
    </div>
  );
}
