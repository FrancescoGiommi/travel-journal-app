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
      className="modal fade delete-modal"
      id="deletePostModal"
      tabIndex={-1}
      aria-labelledby="deletePostModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content delete-modal-content">
          <div className="modal-header delete-modal-header">
            <div className="delete-modal-icon" aria-hidden="true">
              ⚠
            </div>
            <div>
              <h5
                className="modal-title delete-modal-title"
                id="deletePostModalLabel"
              >
                Conferma eliminazione
              </h5>
              <p className="delete-modal-subtitle">
                Questa azione non può essere annullata.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body delete-modal-body">
            <p>
              Sei sicuro di voler eliminare il post <strong>{title}</strong>?
            </p>
            <p className="delete-modal-warning">L'azione è irreversibile.</p>
          </div>
          <div className="modal-footer delete-modal-footer">
            <button
              type="button"
              className="btn btn-app-secondary"
              data-bs-dismiss="modal"
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-app-danger"
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
