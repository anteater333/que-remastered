import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./Dialog.module.scss";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  onCancel,
  onConfirm,
  open,
  title,
  cancelText,
  confirmText,
  description,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.overlay} />
        <AlertDialog.Content className={styles.content}>
          <AlertDialog.Title className={styles.title}>
            {title}
          </AlertDialog.Title>
          {description && (
            <AlertDialog.Description className={styles.description}>
              {description}
            </AlertDialog.Description>
          )}
          <div className={styles.actions}>
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onCancel}
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
