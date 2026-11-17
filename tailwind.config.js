import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				admin: {
					bg: 'hsl(var(--admin-bg))',
					card: 'hsl(var(--admin-card))'
				},
				nav: {
					DEFAULT: 'hsl(var(--nav))',
					foreground: 'hsl(var(--nav-foreground))',
					muted: 'hsl(var(--nav-muted))'
				},
				state: {
					success: 'hsl(var(--success))',
					warning: 'hsl(var(--warning))',
					info: 'hsl(var(--info))',
					danger: 'hsl(var(--danger))',
					neutral: 'hsl(var(--neutral))'
				},
				brand: {
					DEFAULT: '#0F766E',
					700: '#0B5C55',
					900: '#072C29',
					100: '#DCEFEC',
					50: '#F1F8F7'
				},
				cta: {
					DEFAULT: '#C2410C',
					hover: '#9A3412'
				},
				sun: '#F97316',
				ink: '#0F172A',
				cloud: '#F8FAFC',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				heading: ['var(--font-heading)'],
				body: ['var(--font-body)'],
				display: ['var(--font-display)'],
				mono: ['var(--font-mono)']
			},
			boxShadow: {
				soft: '0 22px 60px -28px rgba(15, 23, 42, 0.35)',
				card: '0 1px 2px rgba(15, 23, 42, 0.05), 0 14px 34px -20px rgba(15, 23, 42, 0.28)',
				field: 'inset 0 0 0 1px rgba(15, 23, 42, 0.08)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(18px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slow-zoom': {
					from: { transform: 'scale(1.02)' },
					to: { transform: 'scale(1.12)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.75s cubic-bezier(.2,.7,.2,1) both',
				'slow-zoom': 'slow-zoom 26s ease-out both'
			}
		}
	},
	plugins: [animate],
}
