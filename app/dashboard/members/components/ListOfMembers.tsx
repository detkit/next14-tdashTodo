import { useUserStore } from '@/lib/store/user';
import { IPremission } from '@/lib/types';
import { cn } from '@/lib/utils';
import { readMembers } from '../actions';
import DeleteMember from './DeleteMember';
import EditMember from './edit/EditMember';

export default async function ListOfMembers() {
	const { data: premissions } = await readMembers();

	const user = useUserStore.getState().user;
	const isAdmin =
		useUserStore.getState().user?.user_metadata.role === 'admin';

	return (
		<div className='dark:bg-inherit bg-white mx-2 rounded-sm'>
			{(premissions as IPremission[])?.map((premission, index) => {
				return (
					<div
						className=' grid grid-cols-5  rounded-sm  p-3 align-middle font-normal'
						key={index}
					>
						<h1>{premission.member.name}</h1>

						<div>
							<span
								className={cn(
									' dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize  border-[.5px] text-sm',
									{
										'border-green-500 text-green-600 bg-green-200':
											premission.role === 'admin',
										'border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50':
											premission.role === 'user',
									}
								)}
							>
								{premission.role}
							</span>
						</div>
						<h1>
							{new Date(premission.created_at).toDateString()}
						</h1>
						<div>
							<span
								className={cn(
									' dark:bg-zinc-800 px-2 py-1 rounded-full  capitalize text-sm border-zinc-300  border',
									{
										'text-green-600 px-4 dark:border-green-400 bg-green-200':
											premission.status === 'active',
										'text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400':
											premission.status === 'resigned',
									}
								)}
							>
								{premission.status}
							</span>
						</div>

						<div className='flex gap-2 items-center'>
							{isAdmin && (
								<DeleteMember user_id={premission.member.id} />
							)}
							<EditMember
								isAdmin={isAdmin}
								premission={premission}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
