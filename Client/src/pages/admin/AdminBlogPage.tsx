import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../supabaseClient';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle,
  Loader2,
  FileText,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface ArticleItem {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  published_at: string | null;
  created_at?: string;
}

interface ArticleFormData {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  is_published: boolean;
}

export function AdminBlogPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: '',
      slug: '',
      category: 'Market Insights',
      excerpt: '',
      content: '',
      image_url: '',
      is_published: true,
    },
  });

  const titleValue = watch('title');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      console.error('Failed to fetch articles:', err);
      setErrorMsg(err.message || 'Failed to load blog articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleBlur = () => {
    const currentSlug = watch('slug');
    if (!currentSlug && titleValue) {
      setValue('slug', generateSlug(titleValue));
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    reset({
      title: '',
      slug: '',
      category: 'Market Insights',
      excerpt: '',
      content: '',
      image_url: '',
      is_published: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ArticleItem) => {
    setEditingId(item.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    reset({
      title: item.title || '',
      slug: item.slug || '',
      category: item.category || 'Market Insights',
      excerpt: item.excerpt || '',
      content: item.content || '',
      image_url: item.image_url || '',
      is_published: !!item.published_at,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', deleteConfirmId);

      if (error) throw error;

      setArticles((prev) => prev.filter((a) => a.id !== deleteConfirmId));
      setSuccessMsg('Article deleted successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to delete article:', err);
      setErrorMsg('Failed to delete article: ' + err.message);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const onSubmit = async (values: ArticleFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    const slug = values.slug.trim() || generateSlug(values.title);
    const published_at = values.is_published ? new Date().toISOString() : null;

    const payload = {
      title: values.title.trim(),
      slug: slug,
      category: values.category.trim(),
      excerpt: values.excerpt.trim(),
      content: values.content.trim(),
      image_url: values.image_url.trim(),
      published_at: published_at,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setSuccessMsg('Article updated successfully!');
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([payload]);

        if (error) throw error;
        setSuccessMsg('Article published successfully!');
      }

      setIsDialogOpen(false);
      await fetchArticles();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to save article:', err);
      setErrorMsg(err.message || 'Failed to save article.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q) ||
      a.slug?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-sm">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-sm">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-xs text-red-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
            Blog Articles Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Write, edit, and publish guides and market insights to the public blog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={openCreateDialog}
            className="bg-accent hover:bg-accent/90 text-white shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, category, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50/50"
          />
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          Showing <span className="font-bold text-primary">{filteredArticles.length}</span> of {articles.length} articles
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm font-medium text-slate-500">Loading articles from Supabase...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center px-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No blog articles found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {search
                ? `No articles matched "${search}".`
                : 'No articles have been published to Supabase yet. Click the button below to write your first post.'}
            </p>
            {!search && (
              <Button
                onClick={openCreateDialog}
                className="mt-4 bg-accent hover:bg-accent/90 text-white"
                size="sm"
              >
                Write First Article
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="w-16">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Cover';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-semibold text-primary max-w-xs truncate">
                      {item.title}
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-slate-600 text-sm">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {item.category || 'Insights'}
                      </span>
                    </TableCell>

                    {/* Slug */}
                    <TableCell className="text-slate-500 font-mono text-xs">
                      /blog/{item.slug}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {item.published_at ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                          Draft
                        </span>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-slate-100"
                          title="Edit Article"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold text-primary">
              {editingId ? 'Edit Blog Article' : 'Write New Article'}
            </DialogTitle>
            <DialogDescription>
              Publish articles to share your real estate expertise and attract diaspora and local investors.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Article Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Navigating Land Titles and CFC Mortgages in Cameroon"
                {...register('title', { required: 'Title is required' })}
                onBlur={handleTitleBlur}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Slug & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. land-titles-cfc-mortgages-cameroon"
                  {...register('slug', { required: 'Slug is required' })}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Category
                </label>
                <Input
                  placeholder="e.g. Market Insights, Legal Guide, Diaspora"
                  {...register('category')}
                />
              </div>
            </div>

            {/* Cover Image via ImageUploader */}
            <div className="space-y-1.5">
              <Controller
                control={control}
                name="image_url"
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    table="articles"
                    label="Article Cover Image"
                  />
                )}
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Summary / Excerpt
              </label>
              <Textarea
                placeholder="A concise 1-2 sentence preview for search engines and blog cards..."
                rows={2}
                {...register('excerpt')}
              />
            </div>

            {/* Content (Markdown) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Article Body (Markdown supported) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Supports headers, lists, links</span>
              </div>
              <Textarea
                placeholder="Write your article content here in Markdown format..."
                rows={10}
                className="font-mono text-sm leading-relaxed"
                {...register('content', { required: 'Content is required' })}
              />
              {errors.content && (
                <p className="text-xs text-red-500">{errors.content.message}</p>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : editingId ? (
                  'Update Article'
                ) : (
                  'Publish Article'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this article from Supabase? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
