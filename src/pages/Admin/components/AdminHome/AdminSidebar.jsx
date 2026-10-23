import React, { useState } from 'react';
import { ConfigProvider, Menu, Tooltip } from 'antd';
import Sider from 'antd/es/layout/Sider';

export const AdminSidebar = ({
	onSelect,
	menuItems,
	selectedKey,
}) => {
	const [collapsed, setCollapsed] = useState(false);

	const cyan = '#38bdf8';

	const handleHome = () => {
		onSelect?.('1');
	};

	const sidebarTheme = {
		token: {
			colorPrimary: cyan,
			fontFamily: "'Inter', 'Segoe UI', sans-serif",
			borderRadius: 11,
		},
		components: {
			Menu: {
				darkItemBg: 'transparent',
				darkItemColor: '#9caec4',
				darkItemHoverColor: '#ffffff',
				darkItemHoverBg: 'rgba(56,189,248,0.09)',
				darkItemSelectedBg: 'rgba(56,189,248,0.17)',
				darkItemSelectedColor: '#e0f2fe',
				darkSubMenuItemBg: 'transparent',
				itemHeight: 43,
				itemBorderRadius: 10,
				itemMarginBlock: 4,
				itemMarginInline: 9,
				itemPaddingInline: 12,
			},
			Layout: {
				siderBg: '#0b1220',
				triggerBg: '#111c31',
				triggerColor: '#cbd5e1',
			},
		},
	};

	const brandMark = (
		<div
			style={{
				width: 42,
				height: 42,
				minWidth: 42,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 14,
				background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
				color: '#ffffff',
				fontSize: 23,
				fontWeight: 900,
				fontFamily: 'Arial, sans-serif',
				boxShadow: '0 6px 20px rgba(14,165,233,0.28)',
			}}
		>
			K
		</div>
	);

	return (
		<ConfigProvider theme={sidebarTheme}>
			<Sider
				width={254}
				collapsedWidth={76}
				collapsible
				collapsed={collapsed}
				onCollapse={setCollapsed}
				style={{
					position: 'sticky',
					top: 0,
					height: '100vh',
					overflow: 'hidden',
					flexShrink: 0,
					background: 'linear-gradient(180deg, #0b1220 0%, #101b2e 100%)',
					borderRight: '1px solid rgba(148,163,184,0.12)',
					boxShadow: '7px 0 28px rgba(15,23,42,0.06)',
				}}
			>
				<div
					style={{
						height: 87,
						padding: collapsed ? '0 14px' : '0 19px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: collapsed ? 'center' : 'flex-start',
						gap: 12,
						borderBottom: '1px solid rgba(148,163,184,0.12)',
						boxSizing: 'border-box',
					}}
				>
					<Tooltip
						title={collapsed ? 'TRAVEL WITH KEII — Trang chủ' : ''}
						placement="right"
					>
						<button
							type="button"
							onClick={handleHome}
							aria-label="TRAVEL WITH KEII - Trang chủ"
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 11,
								padding: 0,
								border: 0,
								background: 'transparent',
								cursor: 'pointer',
								textAlign: 'left',
							}}
						>
							{brandMark}

							{!collapsed && (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 4,
									}}
								>
									<span
										style={{
											color: '#f8fafc',
											fontSize: 13,
											fontWeight: 850,
											letterSpacing: '0.055em',
											whiteSpace: 'nowrap',
										}}
									>
										TRAVEL WITH
									</span>

									<span
										style={{
											color: cyan,
											fontSize: 21,
											fontWeight: 900,
											letterSpacing: '0.19em',
											lineHeight: 1,
										}}
									>
										KEII
									</span>
								</div>
							)}
						</button>
					</Tooltip>
				</div>

				{!collapsed && (
					<div
						style={{
							margin: '17px 15px 9px',
							padding: '12px',
							borderRadius: 12,
							background: 'rgba(148,163,184,0.07)',
							border: '1px solid rgba(148,163,184,0.10)',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 7,
								marginBottom: 6,
							}}
						>
							<span
								style={{
									width: 7,
									height: 7,
									borderRadius: '50%',
									background: '#34d399',
									boxShadow: '0 0 9px rgba(52,211,153,0.5)',
								}}
							/>

							<span
								style={{
									color: '#94a3b8',
									fontSize: 10,
									fontWeight: 800,
									letterSpacing: '0.15em',
								}}
							>
								WORKSPACE
							</span>
						</div>

						<div
							style={{
								color: '#e2e8f0',
								fontSize: 12,
								fontWeight: 600,
							}}
						>
							Travel Management
						</div>
					</div>
				)}

				<div
					style={{
						padding: collapsed ? '17px 0 8px' : '13px 15px 8px',
						color: '#64748b',
						fontSize: 10,
						fontWeight: 850,
						letterSpacing: '0.16em',
						textAlign: collapsed ? 'center' : 'left',
					}}
				>
					{collapsed ? 'MENU' : 'MAIN MENU'}
				</div>

				<div
					style={{
						height: collapsed
							? 'calc(100vh - 185px)'
							: 'calc(100vh - 305px)',
						minHeight: 160,
						overflowY: 'auto',
						overflowX: 'hidden',
					}}
				>
					<Menu
						theme="dark"
						mode="inline"
						items={menuItems}
						selectedKeys={selectedKey ? [selectedKey] : []}
						onClick={({ key }) => onSelect?.(key)}
						style={{
							background: 'transparent',
							borderInlineEnd: 0,
							paddingBottom: 12,
						}}
					/>
				</div>

				{!collapsed && (
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 48,
							padding: '12px 19px',
							borderTop: '1px solid rgba(148,163,184,0.10)',
							background: '#0e1829',
						}}
					>
						<div
							style={{
								color: '#64748b',
								fontSize: 10,
								fontWeight: 850,
								letterSpacing: '0.12em',
							}}
						>
							TRAVEL WITH KEII
						</div>

						<div
							style={{
								marginTop: 5,
								color: '#94a3b8',
								fontSize: 11,
							}}
						>
							Admin Dashboard · 2026
						</div>
					</div>
				)}
			</Sider>
		</ConfigProvider>
	);
};