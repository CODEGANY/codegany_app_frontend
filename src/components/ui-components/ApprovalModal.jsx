import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";

/**
 * Modal component for approving or rejecting purchase requests
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Function to call when modal is closed
 * @param {Function} props.onSubmit Function to call when form is submitted
 * @param {'approve'|'reject'|'info'} props.mode The mode of the modal (approve, reject, or info)
 * @param {boolean} [props.isLoading] Whether the form is submitting
 * @returns {JSX.Element} Modal component
 */
const ApprovalModal = ({ isOpen, onClose, onSubmit, mode, isLoading = false }) => {
  const [comment, setComment] = useState('');
  
  // Configure modal based on mode
  const config = {
    approve: {
      title: 'Approuver la demande',
      description: 'La demande sera approuvée et une commande sera automatiquement créée.',
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      buttonText: 'Approuver',
      buttonVariant: 'default',
      commentPlaceholder: 'Commentaire optionnel sur cette approbation...'
    },
    reject: {
      title: 'Rejeter la demande',
      description: 'La demande sera rejetée et le demandeur en sera notifié.',
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      buttonText: 'Rejeter',
      buttonVariant: 'destructive',
      commentPlaceholder: 'Veuillez expliquer la raison du rejet...'
    },
    info: {
      title: "Demander plus d'informations",
      description: 'La demande restera en attente et le demandeur sera notifié de votre demande.',
      icon: <HelpCircle className="h-6 w-6 text-amber-500" />,
      buttonText: 'Envoyer la demande',
      buttonVariant: 'outline',
      commentPlaceholder: 'Précisez les informations supplémentaires nécessaires...'
    }
  }[mode] || config.approve;

  // Reset comment when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setComment('');
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For rejection, comment is required
    if (mode === 'reject' && !comment.trim()) {
      alert('Veuillez fournir une raison pour le rejet de cette demande.');
      return;
    }
    
    // For more info, comment is required
    if (mode === 'info' && !comment.trim()) {
      alert('Veuillez préciser les informations supplémentaires nécessaires.');
      return;
    }
    
    onSubmit(comment);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              {config.icon}
              <DialogTitle>{config.title}</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {config.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea 
              id="comment" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={config.commentPlaceholder}
              rows={4}
              className="resize-none"
              required={mode === 'reject' || mode === 'info'}
            />
          </div>
          
          <DialogFooter className="mt-6 gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant={config.buttonVariant}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : config.buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;
