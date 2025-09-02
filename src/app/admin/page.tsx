"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Camera,
  Upload,
  Loader,
} from "lucide-react";

// Defina a interface para o objeto de propriedade
interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  featured: boolean;
  description: string;
  created_at: string;
}

interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  featured: boolean;
  description: string;
}

const PropertyCRUD = () => {
  // Use a interface para tipar o estado
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    location: "",
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    images: [],
    featured: false,
    description: "",
  });

  // Buscar todas as propriedades
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProperties(
        (data as Property[]).map((p) => ({
          ...p,
          images: p.images || [],
        })) || []
      );
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao buscar propriedades:", error.message);
        setError("Erro ao carregar propriedades: " + error.message);
      } else {
        console.error("Erro ao buscar propriedades:", error);
        setError(
          "Erro ao carregar propriedades: Ocorreu um erro desconhecido."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  // Upload de múltiplas imagens
  const uploadMultipleImages = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return await Promise.all(uploadPromises);
  };

  // Deletar imagem do storage
  const deleteImage = async (imageUrl: string) => {
    try {
      const path = imageUrl.split("/").pop();
      await supabase.storage
        .from("property-images")
        .remove([`properties/${path}`]);
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filtrar propriedades
  const filteredProperties = properties.filter(
    (property) =>
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal
  const openModal = (mode: string, property: Property | null = null) => {
    setModalMode(mode);
    setCurrentProperty(property);
    if (property) {
      setFormData({
        title: property.title || "",
        location: property.location || "",
        price: property.price || "",
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area || 0,
        images: property.images || [],
        featured: property.featured || false,
        description: property.description || "",
      });
      setImageUrls(property.images || []);
    } else {
      setFormData({
        title: "",
        location: "",
        price: "",
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        images: [],
        featured: false,
        description: "",
      });
      setImageUrls([]);
    }
    setImageFiles([]);
    setError(null);
    setIsModalOpen(true);
  };

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProperty(null);
    setImageFiles([]);
    setImageUrls([]);
    setError(null);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
  };

  // Remove image from preview
  const removeImage = async (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      let finalImageUrls = [...imageUrls];

      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const uploadedUrls = await uploadMultipleImages(imageFiles);
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
        setUploadingImages(false);
      }

      const propertyData = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        bedrooms: parseInt(formData.bedrooms.toString()),
        bathrooms: parseInt(formData.bathrooms.toString()),
        area: parseFloat(formData.area.toString()),
        images: finalImageUrls,
        featured: formData.featured,
        description: formData.description,
      };

      if (modalMode === "create") {
        const { data, error } = await supabase
          .from("properties")
          .insert([propertyData])
          .select();

        if (error) throw error;

        setProperties((prev) => [data[0] as Property, ...prev]);
      } else if (modalMode === "edit" && currentProperty) {
        const oldImages = currentProperty.images || [];
        const removedImages = oldImages.filter(
          (img) => !finalImageUrls.includes(img)
        );

        for (const imageUrl of removedImages) {
          await deleteImage(imageUrl);
        }

        const { data, error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", currentProperty.id)
          .select();

        if (error) throw error;

        setProperties((prev) =>
          prev.map((p) =>
            p.id === currentProperty.id ? (data[0] as Property) : p
          )
        );
      }

      closeModal();
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao salvar propriedade:", error.message);
        setError("Erro ao salvar propriedade: " + error.message);
      } else {
        console.error("Erro ao salvar propriedade:", error);
        setError("Erro ao salvar propriedade: Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  // Delete property
  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar esta propriedade?")) {
      return;
    }

    try {
      setLoading(true);

      const property = properties.find((p) => p.id === id);

      if (property?.images?.length) {
        const images = property.images || [];
        for (const imageUrl of images) {
          await deleteImage(imageUrl);
        }
      }

      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      setProperties((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao deletar propriedade:", error.message);
        setError("Erro ao deletar propriedade: " + error.message);
      } else {
        console.error("Erro ao deletar propriedade:", error);
        setError("Erro ao deletar propriedade: Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: "#F5F2ED" }}
    >
      {/* Header */}
      <div
        className="border-b"
        style={{ backgroundColor: "#E0D9CF", borderColor: "#D4CCC0" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Terraventos</h1>
              <p className="text-gray-600 mt-1">
                Gerenciamento de Propriedades
              </p>
            </div>
            <button
              onClick={() => openModal("create")}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#8B7355" }}
              onMouseOver={(e) =>
                !loading && (e.currentTarget.style.backgroundColor = "#7A6148")
              }
              onMouseOut={(e) =>
                !loading && (e.currentTarget.style.backgroundColor = "#8B7355")
              }
            >
              <Plus size={20} />
              Nova Propriedade
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Search and Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
            />
          </div>
          <div className="flex gap-4 text-sm">
            <div
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#E0D9CF" }}
            >
              <span className="text-gray-600">Total: </span>
              <span className="font-semibold">{properties.length}</span>
            </div>
            <div
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: "#E0D9CF" }}
            >
              <span className="text-gray-600">Destaque: </span>
              <span className="font-semibold">
                {properties.filter((p) => p.featured).length}
              </span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && !isModalOpen && (
          <div className="text-center py-12">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <p>Carregando propriedades...</p>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                style={{ borderColor: "#E0D9CF" }}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Camera size={40} />
                    </div>
                  )}
                  {property.featured && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white z-10"
                      style={{ backgroundColor: "#8B7355" }}
                    >
                      Destaque
                    </div>
                  )}
                  <div className="absolute top-3 right-3 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded z-10">
                    {property.images?.length || 0} fotos
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#8B7355" }}
                    >
                      {property.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Bed size={14} />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath size={14} />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square size={14} />
                      <span>{property.area}m²</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal("view", property)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
                      style={{ borderColor: "#D4CCC0" }}
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button
                      onClick={() => openModal("edit", property)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                      style={{ backgroundColor: "#8B7355" }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#7A6148")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#8B7355")
                      }
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Nenhuma propriedade encontrada
            </h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou adicione uma nova propriedade.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#E0D9CF" }}
            >
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === "create" && "Nova Propriedade"}
                {modalMode === "edit" && "Editar Propriedade"}
                {modalMode === "view" && "Detalhes da Propriedade"}
              </h2>
              <button
                onClick={closeModal}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    required
                    placeholder="R$ 500.000"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área (m²) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    required
                    min="1"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartos
                  </label>
                  <select
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banheiros
                  </label>
                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured */}
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      disabled={modalMode === "view" || loading}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Propriedade em destaque
                    </span>
                  </label>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={modalMode === "view" || loading}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                  ></textarea>
                </div>

                {/* Images */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens
                  </label>

                  {modalMode !== "view" && (
                    <div className="mb-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading || uploadingImages}
                        className="w-full px-3 py-2 border rounded-lg disabled:opacity-50"
                        style={{ borderColor: "#D4CCC0" }}
                      />
                      {uploadingImages && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                          <Loader className="animate-spin" size={16} />
                          Fazendo upload das imagens...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Existing Images */}
                  {imageUrls.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Imagens atuais:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative h-20 rounded border overflow-hidden"
                            style={{ borderColor: "#D4CCC0" }}
                          >
                            <Image
                              src={url}
                              alt={`Imagem ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 33vw, 150px"
                            />
                            {modalMode !== "view" && !loading && (
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 z-10"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {imageFiles.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Novas imagens selecionadas:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {imageFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative h-20 rounded border overflow-hidden"
                            style={{ borderColor: "#D4CCC0" }}
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`Nova imagem ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 33vw, 150px"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 z-10"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                  style={{ borderColor: "#D4CCC0" }}
                >
                  {modalMode === "view" ? "Fechar" : "Cancelar"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      uploadingImages ||
                      !formData.title ||
                      !formData.location ||
                      !formData.price
                    }
                    className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#8B7355" }}
                    onMouseOver={(e) =>
                      !loading &&
                      (e.currentTarget.style.backgroundColor = "#7A6148")
                    }
                    onMouseOut={(e) =>
                      !loading &&
                      (e.currentTarget.style.backgroundColor = "#8B7355")
                    }
                  >
                    {loading && <Loader className="animate-spin" size={16} />}
                    {modalMode === "create"
                      ? "Criar Propriedade"
                      : "Salvar Alterações"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCRUD;
