import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

const CATEGORIES = [
  "Market Insights", "Loan Guidance", "Documentation",
  "Diaspora Investment", "Property Verification", "Case Studies"
];

function slugify(title: string) {
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

interface ArticleRow {
  id: string; title: string; slug: string; excerpt: string;
  content: string; category: string; image_url: string | null;
  published_at: string; published: boolean;
}

export function AdminBlogPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [editing, setEditing] = useState<Partial<ArticleRow> | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
    setArticles(data || []);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ title: "", slug: "", excerpt: "", content: "", category: CATEGORIES[0], image_url: null, published: true, published_at: new Date().toISOString().slice(0, 10) });
    setOpen(true);
  };

  const openEdit = (a: ArticleRow) => { setEditing(a); setOpen(true); };

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing, slug: editing.slug || slugify(editing.title || "") };
    if (editing.id) {
      await supabase.from("articles").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("articles").insert(payload);
    }
    setOpen(false);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("articles").delete().eq("id", id);
    load();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-primary">Blog Posts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-accent hover:bg-accent/90">New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <Input placeholder="Title" value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} />
                <Input placeholder="URL slug" value={editing.slug}
                  onChange={e => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                <Select value={editing.category} onValueChange={v => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Short excerpt (shown on the blog card)" value={editing.excerpt}
                  onChange={e => setEditing({ ...editing, excerpt: e.target.value })} rows={2} />
                <Textarea placeholder="Full article content (separate paragraphs with a blank line)" value={editing.content}
                  onChange={e => setEditing({ ...editing, content: e.target.value })} rows={10} />
                <ImageUploader table="articles" currentUrl={editing.image_url}
                  onUploaded={(url) => setEditing({ ...editing, image_url: url })} />
                <div className="flex items-center justify-between">
                  <Input type="date" value={editing.published_at?.slice(0, 10)}
                    onChange={e => setEditing({ ...editing, published_at: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Published</span>
                    <Switch checked={editing.published} onCheckedChange={v => setEditing({ ...editing, published: v })} />
                  </div>
                </div>
                <Button onClick={save} className="w-full bg-primary">Save</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {articles.map(a => (
          <div key={a.id} className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-sm text-gray-500">{a.category} · {a.published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => openEdit(a)}>Edit</Button>
              <Button variant="destructive" onClick={() => remove(a.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
