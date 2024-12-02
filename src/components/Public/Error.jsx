import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import styles from "./CSS/Error.module.css"
// import './CSS/scoped-bootstrap.css'; // 네임스페이스가 적용된 Bootstrap CSS

const LoginErrorModal = ({ close, handleClose, title, message }) => {
    return (
        <>
            {close && <div className={styles["custom-modal-backdrop"]}></div>}
            <Modal
                show={close}
                onHide={handleClose}
                className={styles["custom-modal"]}
                backdrop={false}
            >
                <Modal.Header className={styles["custom-modal-header"]}>
                    <Modal.Title className={styles["custom-modal-title"]}>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles["custom-modal-body"]}>
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer className={styles["custom-modal-footer"]}>
                    <Button
                        onClick={handleClose}
                        className={styles["custom-modal-button"]}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

function WarningModal({ show, setError, title, message, onHide }) {
    const [close, setClose] = useState(show);
    useEffect(() => {
        setClose(show)
    }, [show])

    const handleClose = () => {
        if (onHide) {
            onHide(); // onHide가 전달되면 실행
        }
        setClose(false);
        setError(false);
        return 0;
    }

    return (
        <>
            <LoginErrorModal
                close={close}
                handleClose={handleClose}
                title={title}
                message={message}
            >
            </LoginErrorModal>
        </>
    )
}

export default WarningModal;