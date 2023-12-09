'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { TrashIcon } from '@radix-ui/react-icons';
import { useTransition } from 'react';
import { deleteMemberById } from '../actions';

export default function DeleteMember({ user_id }: { user_id: string }) {
	const [isPending, startTransition] = useTransition();
	const handleSubmit = () => {
		startTransition(async () => {
			const result = JSON.parse(await deleteMemberById(user_id));

			if (result?.error?.message) {
				toast({
					title: 'Failed to deleted',
				});
			} else {
				toast({
					title: 'Successfully deleted',
				});
			}
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<Button variant='outline'>
				<TrashIcon />
				Delete
			</Button>
		</form>
	);
}
