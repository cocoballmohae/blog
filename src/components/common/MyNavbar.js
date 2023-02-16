import React from "react";
import {
  Anchor,
  Button,
  Container,
  Dropdown,
  Form,
  Image,
  InputGroup,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LogoImg from "../../assets/logo.png";
import AuthStore from "../../stores/AuthStore";
import SearchImg from "../../assets/search.png";

const MyNavbar = () => {
  const navigate = useNavigate();
  const authStore = AuthStore();

  return (
    <div style={{ backgroundColor: "lightgray" }}>
      <Navbar>
        <Container>
          <Link to={"/"}>
            <Image src={LogoImg} style={{ height: "40px" }} />
          </Link>
          <div>
            <InputGroup>
              <div>
                {authStore.loginUser ? (
                  <Button
                    variant='success'
                    onClick={() => navigate("/insert-post")}
                    style={{ marginLeft: "10px" }}
                  >
                    새 글 작성
                  </Button>
                ) : (
                  <Button
                    variant='success'
                    onClick={() => {
                      navigate("/login");
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    로그인
                  </Button>
                )}
              </div>
              <Row>
                {authStore.loginUser ? (
                  <NavDropdown
                    title={
                      <Image
                        src={authStore.loginUser.profileImage}
                        className='rounded-circle'
                        style={{
                          marginLeft: "10px",
                          width: "35px",
                          height: "35px",
                        }}
                      />
                    }
                  >
                    <div className='dropdown-item'>
                      <Form className='d-flex'>
                        <Form.Control type='text' placeholder='search' />
                        <button className='btn' type='button'>
                          <Image src={SearchImg} width={"20"} />
                        </button>
                      </Form>
                    </div>
                    <Dropdown.Divider />
                    <Link to={"/my"} className='dropdown-item'>
                      마이페이지
                    </Link>
                    <Dropdown.Divider />
                    <Anchor
                      href='#'
                      onClick={() => {
                        navigate("/login", { replace: true });
                      }}
                      className='dropdown-item'
                    >
                      로그아웃
                    </Anchor>
                  </NavDropdown>
                ) : (
                  <Button
                    variant='success'
                    onClick={() => {
                      navigate("/join");
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    회원가입
                  </Button>
                )}
              </Row>
            </InputGroup>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
