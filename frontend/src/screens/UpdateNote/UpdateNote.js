import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen/MainScreen";
import axios from "axios";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction, updateNoteAction } from "../../actions/notesActions";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ReactMarkdown from "react-markdown";

function UpdateNote({ match, history }) {
  const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [category, setCategory] = useState();
  const [date, setDate] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { loading, error } = noteUpdate;

  const noteDelete = useSelector((state) => state.noteDelete);
  const { loading: loadingDelete, error: errorDelete } = noteDelete;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
    }
    history.push("/mynotes");
  };

  useEffect(() => {
    const getSingleNote = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/notes/${match.params.id}`, config);

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setDate(data.updatedAt);
    };

    getSingleNote();
  }, [match.params.id, date, userInfo]);

  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const updateHandler = (e) => {
    e.preventDefault();
    setValidated(true);

    if (
      e.target[0].value === "" ||
      e.target[1].value === "" ||
      e.target[2].value === ""
    ) {
      return;
    }

    dispatch(updateNoteAction(match.params.id, title, content, category));
    if (!title || !content || !category) return;

    resetHandler();
    history.push("/mynotes");
  };

  return (
    <MainScreen title="Edit Note">
      <Card>
        <Card.Header>Edit your Note</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateHandler}>
            {loading && <LoadingSpinner />}
            {loadingDelete && <LoadingSpinner />}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {errorDelete && <ErrorMessage>{errorDelete}</ErrorMessage>}
            <Form.Group controlId="title" className="mb-2">
              <Form.Label>Title</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="title"
                  placeholder="Enter the title"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter the title.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="content" className="mb-2">
              <Form.Label>Content</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  as="textarea"
                  placeholder="Enter the content"
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter the content.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {content && (
              <Card className="mb-2">
                <Card.Header>Note Preview</Card.Header>
                <Card.Body>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Card.Body>
              </Card>
            )}

            <Form.Group controlId="content" className="mb-3">
              <Form.Label>Category</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="content"
                  placeholder="Enter the Category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter the category.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Note
            </Button>
            <Button
              className="mx-2"
              variant="danger"
              onClick={() => deleteHandler(match.params.id)}
            >
              Delete Note
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Updated on - {date.substring(0, 10)}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default UpdateNote;
