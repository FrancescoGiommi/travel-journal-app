interface DeletePostModalProps {
  postId: number;
  onConfirm: (id: number) => Promise<void>;
  title: string;
  isDeleting?: boolean;
  errorMessage?: string;
}

export default function DeletePostModal({
  postId,
  onConfirm,
  title,
  isDeleting = false,
  errorMessage = "",
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
              !
            </div>
            <div>
              <h5
                className="modal-title delete-modal-title"
                id="deletePostModalLabel"
              >
                Conferma eliminazione
              </h5>
              <p className="delete-modal-subtitle">
                Questa azione non puo essere annullata.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              disabled={isDeleting}
            ></button>
          </div>

          <div className="modal-body delete-modal-body">
            <p>
              Sei sicuro di voler eliminare il post <strong>{title}</strong>?
            </p>
            <p className="delete-modal-warning">L'azione e irreversibile.</p>
            {errorMessage && (
              <div className="app-alert app-alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="modal-footer delete-modal-footer">
            <button
              type="button"
              className="btn btn-app-secondary"
              data-bs-dismiss="modal"
              disabled={isDeleting}
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-app-danger"
              onClick={() => onConfirm(postId)}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminazione..." : "Elimina"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
