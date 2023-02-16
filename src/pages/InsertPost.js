import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import React from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import CommonLayout from "../layouts/CommonLayout";
import WriteLayout from "../layouts/WriteLayout";
import ExitImg from "../assets/exit.svg";
import { json, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthStore from "../stores/AuthStore";
import { useState } from "react";
import { useRef } from "react";
import { customAxios } from "../utils/CustomAxios";
// 글 쓰기
const InsertPost = () => {
  // 저장

  const refs = useRef({
    title: null,
    editor: null,
  });

  const [editorHeight, setEditorHeight] = useState(0);

  const authStore = AuthStore();
  const navigate = useNavigate();

  // 임시저장
  const tempSave = () => {
    const tempPost = {
      title: refs.current.title.value,
      content: refs.current.editor.getInstance().getMarkdown(),
    };
    // stringify = JS객체를 JSON 데이터로 바꿔줌
    localStorage.setItem("tempPost", JSON.stringify(tempPost));

    alert("임시저장되었습니다.");
  };

  const tempPostCheck = () => {
    const tempPost = localStorage.getItem("tempPost");
    if (tempPost != null) {
      if (
        //조건
        window.confirm(
          "임시저장된 글이 있습니다. 불러오시겠습니까? \n취소하시면 임시저장된 글이 삭제됩니다."
        )
      ) {
        //true일때 실행
        // json parse = JSON -> JS 객체
        const tempPostContent = JSON.parse(tempPost);
        refs.current.title.value = tempPostContent.title;
        refs.current.editor.getInstance().setMarkdown(tempPostContent.content);
      } else {
        //false일때
        localStorage.removeItem("tempPost");
      }
    }
  };

  // validateField -> 빈값 걸러내는거 유효성체크
  const validateFields = () => {
    const titleElement = refs.current.title.value;
    const content = refs.current.editor.getInstance().getMarkdown();

    // 널 체크
    if (titleElement === "") {
      alert("제목을 입력해주세요.");
      return false;
    }

    if (content === "") {
      alert("내용을 입력해주세요.");
      return false;
    }
    return true;
  };

  const insertPost = () => {
    if (!validateFields()) {
      return;
    }

    //axios 데이터 넣기
    const titleElement = refs.current.title.value;
    const content = refs.current.editor.getInstance().getMarkdown();

    const markdownImageRegex = /\[.*\]\((.*)\)/gi;
    const markdownRegex = /(\*|_|#|`|~|>|!|\[|\]|\(|\)|\{|\}|\||\\)/gi;

    const summary = content
      .replace(markdownImageRegex, "")
      .replace(markdownRegex, "")
      .substring(0, 151);

    const imageList = content.match(markdownImageRegex);
    const thumbnailMarkdown = imageList != null ? imageList[0] : null;

    const thumbnail = thumbnailMarkdown
      ? thumbnailMarkdown.substring(
          thumbnailMarkdown.indexOf("](") + 2,
          thumbnailMarkdown.length - 1
        )
      : null;

    const post = {
      title: titleElement,
      thumbnail: thumbnail,
      content: content,
      summary: summary,
    };

    customAxios
      .privateAxios({
        method: "post",
        url: "/v1/api/post",
        data: post,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("게시물 저장에 성공했습니다.");
          localStorage.removeItem("tempPost");
          navigate(`/post/${response.data.content.idx}`);
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

  // 에디터 크기 동적
  useEffect(() => {
    refs.current.editor.getInstance().setMarkdown("");
    setEditorHeight(`${window.innerHeight - 200}px`);
    window.addEventListener("resize", () =>
      setEditorHeight(`${window.innerHeight - 200}px`)
    );

    tempPostCheck();
  }, []);

  // 로그인 안한사람 걸러내기
  useEffect(() => {
    if (authStore.loginUser === null) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [authStore]);

  return (
    <CommonLayout>
      <WriteLayout>
        <Row>
          <Col>
            {/* border-0 : 테두리
              fs-1 : 크기
              mt-3 : 여백
          */}
            <Form.Control
              ref={(r) => (refs.current.title = r)}
              className='border-0 fs-1 mt-3'
              type='text'
              placeholder='제목을 입력하세요'
            />
          </Col>
        </Row>
        <Editor
          ref={(r) => (refs.current.editor = r)}
          previewStyle='vertical'
          initialEditType='markdown'
          height={editorHeight}
        />
        <Row className='row fixed-bottom p-3 bg-white shadow-lg'>
          <Col className='col-auto'>
            <Link to={-1}>
              <Image src={ExitImg} className='text-dark' />
              <span className='m-2'>나가기</span>
            </Link>
          </Col>
          <Col className='col-auto'>
            <Button variant='outline-success' type='button' onClick={tempSave}>
              임시저장
            </Button>
          </Col>
          <Col className='col-auto'>
            <Button
              variant='outline-success'
              type='button'
              onClick={insertPost}
            >
              게시하기
            </Button>
          </Col>
        </Row>
      </WriteLayout>
    </CommonLayout>
  );
};

export default InsertPost;
