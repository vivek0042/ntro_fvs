import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const withAuth = (WrappedComponent) => {

  return (props) => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['userroleid', 'UserId']);

    
   useEffect(() => {
      if (!cookies.userroleid || !cookies.UserId) {
        navigate('/');
      }
    }, [cookies, navigate]);
   

      return <WrappedComponent {...props} />;
 
    // Ensure that the WrappedComponent is returned with all props

  };
};

export default withAuth;
