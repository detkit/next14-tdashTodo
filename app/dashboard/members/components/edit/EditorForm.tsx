import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IPremission } from '@/lib/types';
import { cn } from '@/lib/utils';
import AccountForm from './AccountForm';
import AdvanceForm from './AdvanceForm';
import BasicForm from './BasicForm';

export default function EditForm({
	isAdmin,
	premission,
}: {
	isAdmin: boolean;
	premission: IPremission;
}) {
	return (
		<Tabs defaultValue='basic' className='w-full space-y-5'>
			<TabsList
				className={cn(
					'grid w-full',
					isAdmin ? 'grid-cols-3' : 'grid-cols-1'
				)}
			>
				<TabsTrigger value='basic'>Basic</TabsTrigger>

				{isAdmin && (
					<>
						<TabsTrigger value='account'>Acccount</TabsTrigger>
						<TabsTrigger value='advance'>Advance</TabsTrigger>
					</>
				)}
			</TabsList>
			<TabsContent value='basic'>
				<BasicForm premission={premission} />
			</TabsContent>

			{isAdmin && (
				<>
					<TabsContent value='account'>
						<AccountForm premission={premission} />
					</TabsContent>
					<TabsContent value='advance'>
						<AdvanceForm premission={premission} />
					</TabsContent>
				</>
			)}
		</Tabs>
	);
}
