import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string) => toast.dismiss(toastId),
};

export const showConfirm = {
  delete: async (title: string = 'Are you sure?', text: string = 'This action cannot be undone.') => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    return result.isConfirmed;
  },

  approve: async (title: string = 'Approve this record?', text: string = 'This will mark the record as verified.') => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve!',
      cancelButtonText: 'Cancel',
    });
    return result.isConfirmed;
  },

  reject: async (title: string = 'Reject this record?', text: string = 'Please provide a reason for rejection.') => {
    const { value: notes } = await Swal.fire({
      title,
      input: 'textarea',
      inputLabel: 'Rejection reason',
      inputPlaceholder: 'Please explain why this record is being rejected...',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
      },
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
    });
    return notes;
  },
};