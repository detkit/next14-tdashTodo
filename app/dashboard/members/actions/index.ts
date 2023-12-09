'use server';

import { readUserSession } from '@/lib/actions';
import { createSupbaseAdmin, createSupbaseServerClient } from '@/lib/supabase';
import { revalidatePath, unstable_noStore } from 'next/cache';

export async function createMember(data: {
	name: string;
	role: 'user' | 'admin';
	status: 'active' | 'resigned';
	email: string;
	password: string;
	confirm: string;
}) {
	const { data: userSession } = await readUserSession();

	if (userSession.session?.user.user_metadata.role !== 'admin') {
		return JSON.stringify({
			error: { message: 'You are not allowed to do this!' },
		});
	}

	const supabase = await createSupbaseAdmin();

	// create account
	const createResult = await supabase.auth.admin.createUser({
		email: data.email,
		password: data.password,
		email_confirm: true,
		user_metadata: {
			role: data.role,
		},
	});

	if (createResult.error?.message) {
		return JSON.stringify(createResult);
	} else {
		const memberResult = await supabase.from('member').insert({
			name: data.name,
			id: createResult.data.user?.id,
			email: data.email,
		});

		if (memberResult.error?.message) {
			return JSON.stringify(createResult);
		} else {
			const permissionResult = await supabase.from('premission').insert({
				role: data.role,
				member_id: createResult.data.user?.id,
				status: data.status,
			});
			revalidatePath('/dashboard/member');
			return JSON.stringify(permissionResult);
		}
	}
}

export async function updateMemberBasicById(
	id: string,
	data: { name: string }
) {
	const supabase = await createSupbaseServerClient();
	const result = await supabase.from('member').update(data).eq('id', id);
	revalidatePath('/dashboard/member');
	return JSON.stringify(result);
}

export async function updateMemberAdvanceById(
	premission_id: string,
	user_id: string,
	data: { role: 'admin' | 'user'; status: 'active' | 'resigned' }
) {
	const { data: userSession } = await readUserSession();

	if (userSession.session?.user.user_metadata.role !== 'admin') {
		return JSON.stringify({
			error: { message: 'You are not allowed to do this!' },
		});
	}

	const supabaseAdmin = await createSupbaseAdmin();

	const updatedResult = await supabaseAdmin.auth.admin.updateUserById(
		user_id,
		{ user_metadata: { role: data.role } }
	);

	if (updatedResult.error?.message) {
		return JSON.stringify(updatedResult);
	} else {
		const supabase = await createSupbaseServerClient();
		const result = await supabase
			.from('premission')
			.update(data)
			.eq('id', premission_id);
		revalidatePath('/dashboard/member');
		return JSON.stringify(result);
	}
}

export async function updateMemberAccountById(
	user_id: string,
	data: {
		email: string;
		password?: string | undefined;
		confirm?: string | undefined;
	}
) {
	const { data: userSession } = await readUserSession();

	if (userSession.session?.user.user_metadata.role !== 'admin') {
		return JSON.stringify({
			error: { message: 'You are not allowed to do this!' },
		});
	}

	let updateObject: {
		email: string;
		password?: string | undefined;
	} = { email: data.email };

	if (data.password) {
		updateObject['password'] = data.password;
	}

	const supabaseAdmin = await createSupbaseAdmin();

	const updatedResult = await supabaseAdmin.auth.admin.updateUserById(
		user_id,
		updateObject
	);

	if (updatedResult.error?.message) {
		return JSON.stringify(updatedResult);
	} else {
		const supbase = await createSupbaseServerClient();
		const result = await supbase
			.from('member')
			.update({ email: data.email })
			.eq('id', user_id);
		revalidatePath('/dashboard/member');
		return JSON.stringify(result);
	}
}

export async function deleteMemberById(user_id: string) {
	const { data: userSession } = await readUserSession();

	if (userSession.session?.user.user_metadata.role !== 'admin') {
		return JSON.stringify({
			error: { message: 'You are not allowed to do this!' },
		});
	}

	const supabaseAdmin = await createSupbaseAdmin();
	const deleteResult = await supabaseAdmin.auth.admin.deleteUser(user_id);

	if (deleteResult.error?.message) {
		return JSON.stringify(deleteResult);
	} else {
		const supbase = await createSupbaseServerClient();
		const result = await supbase.from('member').delete().eq('id', user_id);
		revalidatePath('/dashboard/member');

		return JSON.stringify(result);
	}
}

export async function readMembers() {
	unstable_noStore();

	const supbase = await createSupbaseServerClient();
	return await supbase.from('premission').select('*,member(*)');
}
