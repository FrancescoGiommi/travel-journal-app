interface DeletePostModalProps {
  postId: number;
  onConfirm: (id: number) => void;
  title: string;
}

export default function DeletePostModal({
  postId,
  onConfirm,
  title,
}: DeletePostModalProps) {
  return (
    <div
      className="modal fade"
      id="deletePostModal"
      tabIndex={-1}
      aria-labelledby="deletePostModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deletePostModalLabel">
              Conferma eliminazione
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Sei sicuro di voler eliminare il post <strong>{title}</strong>?
            L'azione è irreversibile.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onConfirm(postId)}
              data-bs-dismiss="modal"
            >
              Elimina
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
