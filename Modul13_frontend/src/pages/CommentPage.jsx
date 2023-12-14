import { Alert, Col, Container, Row, Form, Spinner, Stack, Button, Modal, Card, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getThumbnail } from "../api";
import { GetContentById } from "../api/apiContent";
import { useNavigate, useParams } from "react-router-dom";
import { GetKomentarsByContent, CreateKomentars, UpdateKomentars, DeleteKomentars } from "../api/apiKomentar";
import { FaEdit, FaSave, FaTrashAlt, FaVideo } from "react-icons/fa";

const ReviewPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [contents, setContents] = useState([]);
    const [isPending, setIsPending] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState();
    const [inputReview, setInputReview] = useState("");
    const [editReview, setEditReview] = useState("");
    const [reviews, setReview] = useState([]);
    const [selectedReview, setSelectedReview] = useState([]);

    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);

    const handleCloseEdit = () => setShowModalEdit(false);
    const handleCloseDelete = () => setShowModalDelete(false);

    useEffect(() => {
        setIsLoading(true);
        GetContentById(id)
            .then((response) => {
                setContents(response);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
        setUser(JSON.parse(sessionStorage.getItem("user")));
        console.log(user);
        fetchReviews();
        console.log(reviews);
    }, [id]);

    const fetchReviews = () => {
        setIsLoading(true);
        GetKomentarsByContent(id).then((response) => {
            setReview(response);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    };

    const addReview = () => {
      if (!inputReview.trim()) {
        toast.error("Komentar tidak boleh kosong!");
        return;
      }

        setIsPending(true);
        console.log(inputReview);
        CreateKomentars({
            id_content: id,
            comment: inputReview,

        }).then((response) => {
            setIsPending(false);
            toast.success(response.message);
            fetchReviews();
            setInputReview("");
        }).catch((err) => {
            console.log(err);
            setIsPending(false);
            toast.dark(err.message);
        })
    };

    const handleEdit = (review) => {
        setShowModalEdit(true);
        setSelectedReview(review);
        setEditReview(review.comment);
    }
    const handleDelete = (review) => {
        setShowModalDelete(true);
        setSelectedReview(review);
    };

    const updateReviews = () => {
        setIsPending(true);
        console.log(selectedReview);
        console.log(selectedReview.id);
        UpdateKomentars({
            id: selectedReview.id,
            comment: editReview,
        }).then((response) => {
            setIsPending(false);
            toast.success(response.message);
            handleCloseEdit();
            fetchReviews();
        }).catch((err) => {
            console.log(err);
            setIsPending(false);
            toast.dark(err.message);
        })
    };

    const deleteComments = () => {
        setIsPending(true);
        DeleteKomentars(selectedReview.id).then((response) => {
            setIsPending(false);
            toast.success(response.message);
            handleCloseDelete();
            fetchReviews();
        }).catch((err) => {
            console.log(err);
            setIsPending(false);
            toast.dark(err.message);
        })
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false, 
        };
        const formattedDate = new Date(dateString).toLocaleDateString(
            undefined,
            options
        );
        return formattedDate;
    };

    return (
      <Container className="mt-4">
        <Stack direction="horizontal" gap={3} className="mb-3">
          <h1 className="h4 fw-bold mb-0 text-nowrap">Review Video</h1>
          <hr className="border-top border-light opacity-50 w-100" />
        </Stack>
        {isLoading ? (
          <div className="text-center">
            <Spinner
              as="span"
              animation="border"
              variant="primary"
              size="lg"
              role="status"
              aria-hidden="true"
            />
            <h6 className="mt-2 mb-0">Loading...</h6>
          </div>
        ) : contents != null ? (
          <div>
            <Card>
              <Card.Img
                variant="top"
                src={getThumbnail(contents.thumbnail)}
                style={{ aspectRatio: "16 / 9" }}
                className="card-img w-100 object-fit-cover h-100 bg-light "
              />
              <Card.Body>
                <Card.Title>
                  {" "}
                  <FaVideo className="mb-3 fs-1 me-2" /> {contents.title}
                </Card.Title>
                <Card.Text>{contents.description}</Card.Text>
              </Card.Body>
            </Card>
            <div>
              <div className="mt-4">
                <p className="fs-5 fw-bold mb-1">Reviews</p>
                <p className="fs-6">Tuliskan review baru:</p>
                <Stack direction="horizontal" className="mb-3">
                  <Form.Group className="w-100 me-3 mb-0">
                    <FloatingLabel
                      className="fw-bold text-light"
                      label="Add New Comment"
                    >
                      <Form.Control
                        className="text-light bg-transparent border-secoondary"
                        placeholder="Add New Comment"
                        value={inputReview}
                        onChange={(e) => setInputReview(e.target.value)}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="h-100"
                    onClick={addReview}
                  >
                    Kirim
                  </Button>
                </Stack>
              </div>
              {/* Comment Section */}
              <div className="mt-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card className="mb-3 bg-transparent" key={review.id}>
                      <Card.Body className="d-flex align-items-center">
                        <div>
                          <img
                            src="https://e0.pxfuel.com/wallpapers/400/708/desktop-wallpaper-cartoon-aesthetic-grunge-icon-aesthetic-cartoon-soft-aesthetic-cartoon.jpg"
                            className="rounded-circle me-3"
                            style={{ width: "4rem", height: "4rem" }}
                          />
                        </div>
                        <div className="w-100">
                          <h6 className="fw-bold">@{review.user.handle}</h6>
                          <p className="mb-0">{review.comment}</p>
                        </div>
                        <p className="mb-0 mx-4 text-end">
                          {formatDate(review.date_added)}
                        </p>
                        {user?.id === review.id_user && (
                          <div className="flex-shrink-0 flex">
                            <Button
                              variant="primary"
                              className="me-2"
                              onClick={() => handleEdit(review)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(review)}
                            >
                              <FaTrashAlt />
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Alert variant="dark" className="text-center">
                    No reviews available!
                  </Alert>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Alert variant="dark" className="text-center">
            Video tidak ada!
          </Alert>
        )}

        <Modal show={showModalEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              className="text-light bg-transparent border-secondary"
              placeholder="Edit Comment"
              value={editReview}
              onChange={(e) => setEditReview(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Close
            </Button>
            <Button variant="primary" onClick={updateReviews}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Apakah Anda yakin dengan sungguh-sungguh ingin menghapus comment
              ini:
            </p>
            <p className="lead fw-bold mb-0">{selectedReview.comment}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteComments}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );

};

export default ReviewPage;
