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
import { Switch } from '../../components/ui/switch';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  Loader2,
  Building2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface PropertyItem {
  id: string | number;
  title: string;
  location: string;
  price: string;
  beds: number | null;
  baths: number | null;
  area: string;
  description: string;
  features: string;
  documents: string;
  verified: boolean;
  image_url: string;
  created_at?: string;
}

interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  beds: number | string;
  baths: number | string;
  area: string;
  description: string;
  features: string;
  documents: string;
  verified: boolean;
  image_url: string;
}

export function AdminListingsPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
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
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      location: '',
      price: '',
      beds: '',
      baths: '',
      area: '',
      description: '',
      features: '',
      documents: '',
      verified: false,
      image_url: '',
    },
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      console.error('Failed to fetch properties:', err);
      setErrorMsg(err.message || 'Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    reset({
      title: '',
      location: '',
      price: '',
      beds: '',
      baths: '',
      area: '',
      description: '',
      features: '',
      documents: '',
      verified: false,
      image_url: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: PropertyItem) => {
    setEditingId(item.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    reset({
      title: item.title || '',
      location: item.location || '',
      price: item.price || '',
      beds: item.beds ?? '',
      baths: item.baths ?? '',
      area: item.area || '',
      description: item.description || '',
      features: item.features || '',
      documents: item.documents || '',
      verified: !!item.verified,
      image_url: item.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleToggleVerified = async (item: PropertyItem) => {
    const newStatus = !item.verified;
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, verified: newStatus } : p))
    );

    try {
      const { error } = await supabase
        .from('properties')
        .update({ verified: newStatus })
        .eq('id', item.id);

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Failed to update verification status:', err);
      // Revert optimistic update
      setProperties((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, verified: item.verified } : p))
      );
      alert('Could not update verification status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', deleteConfirmId);

      if (error) throw error;

      setProperties((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      setSuccessMsg('Property listing successfully deleted.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to delete property:', err);
      setErrorMsg('Failed to delete property: ' + err.message);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const onSubmit = async (values: PropertyFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      title: values.title.trim(),
      location: values.location.trim(),
      price: values.price.trim(),
      beds: values.beds === '' ? null : Number(values.beds),
      baths: values.baths === '' ? null : Number(values.baths),
      area: values.area.trim(),
      description: values.description.trim(),
      features: values.features.trim(),
      documents: values.documents.trim(),
      verified: values.verified,
      image_url: values.image_url.trim(),
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setSuccessMsg('Listing updated successfully!');
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([payload]);

        if (error) throw error;
        setSuccessMsg('New listing published successfully!');
      }

      setIsDialogOpen(false);
      await fetchProperties();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to save listing:', err);
      setErrorMsg(err.message || 'Failed to save listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.price?.toLowerCase().includes(q)
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
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-600 hover:underline"
          >
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
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs text-red-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
            Property Listings Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create, edit, verify, or remove listings shown on the public site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={openCreateDialog}
            className="bg-accent hover:bg-accent/90 text-white shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, neighborhood, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50/50"
          />
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          Showing <span className="font-bold text-primary">{filteredProperties.length}</span> of {properties.length} listings
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm font-medium text-slate-500">Loading listings from Supabase...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No properties found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {search
                ? `No properties matched "${search}". Try searching for something else.`
                : 'No property listings exist yet. Click the button below to add your first listing.'}
            </p>
            {!search && (
              <Button
                onClick={openCreateDialog}
                className="mt-4 bg-accent hover:bg-accent/90 text-white"
                size="sm"
              >
                Add First Property
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="w-16">Photo</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-center">Verified</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((item) => (
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
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Photo';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-semibold text-primary max-w-xs truncate">
                      {item.title}
                    </TableCell>

                    {/* Location */}
                    <TableCell className="text-slate-600 text-sm">
                      {item.location}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-medium text-slate-900 whitespace-nowrap">
                      {item.price}
                    </TableCell>

                    {/* Verified Toggle */}
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2">
                        <Switch
                          checked={item.verified}
                          onCheckedChange={() => handleToggleVerified(item)}
                          title="Click to toggle verified badge"
                        />
                        <span className="text-xs text-slate-500 font-medium">
                          {item.verified ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </span>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-slate-100"
                          title="Edit Listing"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Listing"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-bold text-primary">
              {editingId ? 'Edit Property Listing' : 'Create New Property Listing'}
            </DialogTitle>
            <DialogDescription>
              Fill out all property details below. These values directly populate the public /listings catalog.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Property Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Modern Villa in Bastos"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Location & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Bastos, Yaoundé"
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && (
                  <p className="text-xs text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. 85,000,000 FCFA"
                  {...register('price', { required: 'Price is required' })}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Beds, Baths, Area */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Beds
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 4"
                  {...register('beds')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Baths
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 3"
                  {...register('baths')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Area
                </label>
                <Input
                  placeholder="e.g. 250m²"
                  {...register('area')}
                />
              </div>
            </div>

            {/* Photo via ImageUploader */}
            <div className="space-y-1.5">
              <Controller
                control={control}
                name="image_url"
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    table="properties"
                    label="Property Photo"
                  />
                )}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Description
              </label>
              <Textarea
                placeholder="Full description of the property, surroundings, and investment potential..."
                rows={3}
                {...register('description')}
              />
            </div>

            {/* Features & Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Key Features / Amenities
                </label>
                <Input
                  placeholder="e.g. Generator, Security post, Garden"
                  {...register('features')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Documentation Status
                </label>
                <Input
                  placeholder="e.g. Land Title Deed Available"
                  {...register('documents')}
                />
              </div>
            </div>

            {/* Verified Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-primary">Verified Property Badge</p>
                <p className="text-xs text-slate-500">
                  Display the green verified checkmark showing documents have been validated.
                </p>
              </div>
              <Controller
                control={control}
                name="verified"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
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
                  'Update Listing'
                ) : (
                  'Publish Listing'
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
            <AlertDialogTitle>Delete Property Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this property listing from Supabase and remove it from the public website immediately. This action cannot be undone.
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
