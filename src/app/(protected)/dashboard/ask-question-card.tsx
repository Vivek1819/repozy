'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import React, { useState } from 'react'
import Image from 'next/image'

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = useState('');
    const [open, setOpen] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setOpen(true);
    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Image src='/logo.png' alt='Logo' width={70} height={70} />
                        </DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Card className='relative col-span-1'>
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='How do I change the styling of the pages?' />
                        <div className='h-4'></div>
                        <Button type='submit'>
                            Ask Repozy
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard
