import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SET_LOGIN } from '../../redux/features/auth/authSlice'
import { logoutUser } from '../../services/authService'


const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async(e) => {
    await logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  return (
    <div className='--pad header'>
        <div className='--flex-between'>
            <h3>
            <span className='--fw-thin'>Welcome, </span>
            <span className='--color-danger'>Ricky</span>
            </h3>
            <button onClick={logout} className='--btn --btn-danger'>Logout</button>
        </div>
        <hr />
    </div>
  )
}

export default Header