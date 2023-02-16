import React, { useEffect, useRef } from "react";
import CommonLayout from "../layouts/CommonLayout";
import LogoImg from "../assets/logo.png";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { customAxios } from "../utils/CustomAxios";
import AuthStore from "../stores/AuthStore";

// 로그인
const Login = () => {
  const refs = useRef({
    idElement: null,
    pwElement: null,
    rememberMeElement: null,
  });

  const navigate = useNavigate();
  const authStore = AuthStore();

  const validateFields = () => {
    // 아이디랑 비밀번호가 빈 값인지
    // useRef 구조분할 받아서
    // if문 -> 안썼으면 false
    // 다 통과되면 true

    const { idElement, pwElement } = refs.current;

    if (idElement.value === "") {
      alert("아이디를 입력해주세요.");
      idElement.focus();
      return false;
    }

    if (pwElement.value === "") {
      alert("비밀번호를 입력해주세요.");
      pwElement.focus();
      return false;
    }

    return true;
  };

  const requestLogin = () => {
    if (!validateFields()) {
      return;
    }

    const { idElement, pwElement, rememberMeElement } = refs.current;

    const loginUser = {
      id: idElement.value,
      password: pwElement.value,
    };

    customAxios
      .publicAxios({
        method: "post",
        url: "/login",
        data: loginUser,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          //로그인 성공했으면
          if (rememberMeElement.checked) {
            localStorage.setItem("rememberId", JSON.stringify(idElement.value));
          } else {
            localStorage.removeItem("rememberId");
          }

          const token = response.data.accessToken;
          localStorage.setItem("accessToken", token);
          navigate("/");
        }
      })
      .catch((error) => {
        if (error?.response?.data?.detail != null) {
          alert(JSON.stringify(error?.response?.data?.detail));
        } else {
          alert("알 수 없는 오류");
        }
      })
      .finally(() => {});
  };

  const enterKeyLogin = (event) => {
    if (event.keyCode === 13) {
      requestLogin();
    }
  };

  // useEffect
  // 처음 렌더링할때 로컬스토리지에 rememberId가 있으면
  // id값 채워넣고, 체크박스 체크

  const setLoginPage = () => {
    const rememberId = JSON.parse(localStorage.getItem("rememberId"));
    if (rememberId !== null) {
      refs.current.idElement.value = rememberId;
      refs.current.rememberMeElement.checked = true;
    }
  };

  useEffect(() => {
    setLoginPage();
  }, []);

  useEffect(() => {
    authStore.setLoginUser(null);
  }, [authStore]);

  return (
    <CommonLayout>
      <Card style={{ borderRadius: "1rem", textAlign: "center" }}>
        <Card.Body>
          <h3>
            <img src={LogoImg} style={{ height: "100px" }} />
          </h3>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='idAddOn'>아이디</InputGroup.Text>
            <Form.Control
              ref={(r) => (refs.current.idElement = r)}
              type='text'
            />
          </InputGroup>

          <InputGroup className='mb-3'>
            <InputGroup.Text id='pwAddOn'>비밀번호</InputGroup.Text>
            <Form.Control
              ref={(r) => (refs.current.pwElement = r)}
              type='password'
              onKeyUp={enterKeyLogin}
            />
          </InputGroup>

          <Form.Group style={{ float: "right" }}>
            <Form.Check
              ref={(r) => (refs.current.rememberMeElement = r)}
              type='checkbox'
              label='아이디 기억하기'
            />
          </Form.Group>

          <Button
            variant='primary'
            type='button'
            style={{ width: "100%" }}
            onClick={requestLogin}
          >
            로그인
          </Button>

          <hr />
          <Link to='/join' style={{ float: "right" }}>
            아이디가 없으신가요? 회원가입
          </Link>
        </Card.Body>
      </Card>
    </CommonLayout>
  );
};

export default Login;
