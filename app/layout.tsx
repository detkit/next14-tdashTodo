import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';

const jost = Jost({
	subsets: ['latin'],
	weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
	title: {
		template: '%s | Todo',
		default: 'Todo Dash',
	},
	authors: {
		name: 'chensokheng',
	},
	description: 'Build dashboard with role managemanet using next.js and supabase.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${jost.className} antialiased dark:bg-[#09090B]`}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
					<main className=''>{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
