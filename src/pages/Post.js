import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import AuthStore from "../stores/AuthStore";
import { customAxios } from "../utils/CustomAxios";
import LikeRedImg from "../assets/like-red.svg";
import LikeImg from "../assets/like.svg";
import { Viewer } from "@toast-ui/react-editor";
import produce from "immer";

// 글 상세보기
const Post = () => {
  const params = useParams();
  // console.log(params.idx);
  const postIdx = params.idx;

  const authStore = AuthStore();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const clickLike = () => {
    if (authStore.loginUser == null) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    customAxios
      .privateAxios({
        method: "post",
        url: `/v1/api/post/like/${postIdx}`,
      })
      .then((response) => {
        if (response === 200) {
          setPost(
            produce((draft) => {
              draft.likeCount = response.data.content.likeCount;
              draft.likeClicked = response.data.content.likeClicked;
            })
          );
        } else if (response === -1) {
          setPost(
            produce((draft) => {
              draft.likeCount = response.data.content.likeCount;
              draft.likeClicked = response.data.content.likeClicked;
            })
          );
        } else {
          alert(response.data.message);
        }
        getPost();
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

  const deletePost = () => {
    if (authStore.loginUser == null) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?") === false) {
      return;
    }

    customAxios
      .privateAxios({
        method: "post",
        url: `/v1/api/post/delete/${postIdx}`,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("삭제되었습니다.");
          navigate("/");
        } else {
          alert(response.data.message);
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

  const getPost = useCallback(() => {
    // NaN -> Not a Number
    if (isNaN(postIdx)) {
      alert("잘못된 접근입니다.");
      return;
    }

    customAxios
      .privateAxios({
        method: "get",
        url: `/v1/api/post/${postIdx}`,
      })
      .then((response) => {
        if (response.status === 200) {
          setPost(response.data.content);
        } else {
          alert(response.data.message);
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
  });

  useEffect(() => {
    if (authStore.loginUser === null) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      getPost();
    }
  }, []);

  return (
    <CommonLayout>
      {post != null ? (
        <Container>
          <h1>{post.title}</h1>

          <div className='d-flex justify-content-between align-items-center'>
            {/* 작성자 정보 */}
            <div>
              <span>
                <Image
                  src={post.writer.profileImage}
                  className='rounded-circle me-3'
                  style={{ width: "35px", height: "35px" }}
                  alt='profile'
                />
                <strong>{post.writer.id}</strong>
              </span>
              <span className='text-black-50 ms-4'>
                {post.createDate.substring(0, 10)}
                &nbsp;
                {post.createDate.substring(11, 19)}
              </span>
            </div>

            <butoon id='likeButton' className='btn' onClick={clickLike}>
              <Image
                src={post.likeClicked ? LikeRedImg : LikeImg}
                width='20'
                alt='like'
              />
              <span id='likeCount' className='text-black-50 mx-2'>
                {post.like}
              </span>
            </butoon>

            {authStore.loginUser.idx != null &&
            authStore.loginUser.idx === post.writer.idx ? (
              <div>
                <Button
                  variant='outline-success'
                  type='button'
                  onClick={() => navigate(`/update-post/${postIdx}`)}
                >
                  수정
                </Button>
                <Button
                  variant='outline-danger'
                  className='ms-2'
                  type='button'
                  onClick={deletePost}
                >
                  삭제
                </Button>
              </div>
            ) : null}
          </div>
          <div style={{ marginTop: "100px" }}>
            {post ? <Viewer initialValue={post.content} /> : null}
          </div>

          <Row className='mt-5'>
            <Col className='d-flex justify-content-center'>
              <Button
                variant='outline-dark'
                type='button'
                onClick={() => navigate("/")}
              >
                목록으로
              </Button>
            </Col>
          </Row>
        </Container>
      ) : null}
    </CommonLayout>
  );
};

export default Post;
