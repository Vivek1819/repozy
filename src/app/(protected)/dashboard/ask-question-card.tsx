'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import React, { useState } from 'react'
import Image from 'next/image'
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filesReferences, setFilesReferences] = useState<{ fileName: string, sourceCode: string, summary: string }[]>([]);
    const [answer, setAnswer] = useState('');
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFilesReferences([]);
        e.preventDefault();
        if (!project?.id) return;
        setLoading(true);

        const { output, filesReferences } = await askQuestion(question, project.id);
        setOpen(true);
        setFilesReferences(filesReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setLoading(false);
    }

    const refetch = useRefetch()

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm: max-w-[80vw]'>
                    <DialogHeader>
                        <div className='flex items-center gap-5'>
                            <DialogTitle>
                                <Image src='/logo.png' alt='Logo' width={70} height={70} />
                            </DialogTitle>
                            <Button variant={'outline'}
                                disabled={saveAnswer.isPending}
                                onClick={() => {
                                    saveAnswer.mutate({
                                        projectId: project!.id,
                                        question,
                                        answer,
                                        filesReferences
                                    }, {
                                        onSuccess: () => {
                                            toast.success("Answer saved!");
                                            refetch();
                                        },
                                        onError: () => {
                                            toast.error('Failed to save Answer');
                                        }
                                    })
                                }}>
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className='max-w-[70vw] !h-full max-h-[30vh] overflow-y-auto overflow-x-hidden bg-transparent p-4 border rounded-lg'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {answer}
                        </ReactMarkdown>
                    </div>

                    <div className="h-4"></div>
                    <div className="mt-4">
                        <CodeReferences filesReferences={filesReferences} />
                    </div>

                    <Button type='button' onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
            <Card className='relative col-span-1'>
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            placeholder='How do I change the styling of the pages?'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className='h-4'></div>
                        <Button type='submit' disabled={loading}>
                            Ask Repozy
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard;
