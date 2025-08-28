import React from "react";
import "./confirmDialog.scss";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title = "Confirm",
    message = "Are you sure you want to continue?",
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-box">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-btn" onClick={onConfirm}>
                        Yes, Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
