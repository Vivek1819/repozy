import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { AppSidebar } from './app-sidebar'
import Image from 'next/image'

type Props = {
    children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full m-2'>
                <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-8'>
                    <div className='flex items-center justify-center w-full'>
                        <Image src='/logo.png' alt='Logo' height={40} width={40} />
                        <span className='text-md text-center'>
                            Repozy
                        </span>
                    </div>
                    <div className='ml-auto'></div>
                    <UserButton />
                </div>
                <div className="h-4"></div>
                {/*main conten */}
                <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default SidebarLayout
