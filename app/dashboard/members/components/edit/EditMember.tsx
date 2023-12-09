import { Button } from '@/components/ui/button';
import { IPremission } from '@/lib/types';
import { Pencil1Icon } from '@radix-ui/react-icons';
import DailogForm from '../DialogForm';
import EditForm from './EditorForm';

export default function EditMember({
	isAdmin,
	premission,
}: {
	isAdmin: boolean;
	premission: IPremission;
}) {
	return (
		<DailogForm
			id='update-trigger'
			title='Edit Member'
			Trigger={
				<Button variant='outline'>
					<Pencil1Icon />
					Edit
				</Button>
			}
			form={<EditForm isAdmin={isAdmin} premission={premission} />}
		/>
	);
}
