import React, { useState } from 'react';
import { Bold, Italic, Strikethrough, Smile, Undo } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type Props = {
  content: string;
  onChange: (text: string) => void;
  adjustHeight?: boolean;
}

const MessageEditor = (props: Props) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]); // Histórico de mudanças

  const applyFormatting = (format: string) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `*${selectedText}*`; // Negrito no WhatsApp
        break;
      case 'italic':
        formattedText = `_${selectedText}_`; // Itálico no WhatsApp
        break;
      case 'strikethrough':
        formattedText = `~${selectedText}~`; // Tachado no WhatsApp
        break;
      default:
        return;
    }
    saveHistory(); // Salvar o estado atual antes de aplicar a formatação
    props.onChange(props.content.replace(selectedText, formattedText));
  };

  const addEmoji = (emoji: any) => {
    if (selectionStart !== null && selectionEnd !== null) {
      const beforeCursor = props.content.slice(0, selectionStart);
      const afterCursor = props.content.slice(selectionEnd);
      const updatedMessage = `${beforeCursor}${emoji.native}${afterCursor}`;

      saveHistory(); // Salvar o estado atual antes de adicionar o emoji
      props.onChange(updatedMessage);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveHistory(); // Salvar o estado atual antes da mudança
    props.onChange(e.target.value);
    setSelectionStart(e.target.selectionStart);
    setSelectionEnd(e.target.selectionEnd);
  };

  const saveHistory = () => {
    setHistory((prevHistory) => [...prevHistory, props.content]);
  };

  const undoLastChange = () => {
    if (history.length > 0) {
      const lastContent = history[history.length - 1];
      setHistory(history.slice(0, history.length - 1)); // Remover o último item do histórico
      props.onChange(lastContent);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-x-2 mb-4">
        <Button onClick={() => applyFormatting('bold')} aria-label="Negrito" size="icon" variant="outline">
          <Bold size={16} />
        </Button>
        <Button onClick={() => applyFormatting('italic')} aria-label="Itálico" size="icon" variant="outline">
          <Italic size={16} />
        </Button>
        <Button onClick={() => applyFormatting('strikethrough')} aria-label="Tachado" size="icon" variant="outline">
          <Strikethrough size={16} />
        </Button>
        <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} aria-label="Inserir emoji" size="icon" variant="outline">
          <Smile size={16} />
        </Button>
        <Button onClick={undoLastChange} aria-label="Desfazer última mudança" size="icon" variant="outline" disabled={history.length === 0}>
          <Undo size={16} />
        </Button>
      </div>
      {showEmojiPicker && (
        <div className="absolute z-10" >
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
      <Textarea
        className={cn("h-64", props.adjustHeight && "lg:h-96")}
        value={props.content}
        onChange={handleTextareaChange}
        onSelect={(e: any) => {
          setSelectionStart(e.target.selectionStart);
          setSelectionEnd(e.target.selectionEnd);
        }}
        placeholder="Digite sua mensagem..."
        rows={5}
      />
    </div>
  );
};

export default MessageEditor;
