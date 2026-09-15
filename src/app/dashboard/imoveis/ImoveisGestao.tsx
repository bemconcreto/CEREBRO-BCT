"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */

type DocumentoItem = { nome: string; url: string };
type ImagemItem = { url: string; legenda?: string };

type Documentos = {
  matricula?: DocumentoItem[];
  contratos?: DocumentoItem[];
  tokenizacao?: DocumentoItem[];
  relatorios?: DocumentoItem[];
  auditorias?: DocumentoItem[];
};

type Imovel = {
  id: number;
  nome: string;
  slug?: string;
  localizacao: string;
  descricao: string;
  valorCompra: number;
  valorMercado: number;
  percentualPool: number;
  status?: string;
  imagemUrl?: string | null;
  imagens?: ImagemItem[] | null;
  roiProjetado?: number | null;
  roiRealizado?: number | null;
  dataAquisicao?: string | null;
  statusDocumental?: string | null;
  documentos?: Documentos | null;
};

const CATEGORIAS_DOCUMENTOS: { key: keyof Documentos; label: string }[] = [
  { key: "matricula", label: "Matrícula" },
  { key: "contratos", label: "Contratos" },
  { key: "tokenizacao", label: "Tokenização" },
  { key: "relatorios", label: "Relatórios" },
  { key: "auditorias", label: "Auditorias" },
];

function toDateInputValue(date?: string | null) {
  return date ? date.substring(0, 10) : "";
}

/* ================= PAGE ================= */

export default function ImoveisGestao() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [form, setForm] = useState<Imovel | null>(null);

  const [abrirNovo, setAbrirNovo] = useState(false);
  const [editar, setEditar] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState(false);

  /* ===== LOAD ===== */
  useEffect(() => {
    fetch("/api/imoveis")
      .then((r) => r.json())
      .then((data) => {
        setImoveis(Array.isArray(data) ? data : data.imoveis || data.data || []);
      });
  }, []);

  /* ===== CREATE ===== */
  async function criarImovel(novo: Omit<Imovel, "id">) {
    const res = await fetch("/api/imoveis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });

    const criado = await res.json();
    setImoveis((prev) => [...prev, criado]);
    setAbrirNovo(false);
  }

  /* ===== UPDATE ===== */
  async function atualizarImovel(dados: Omit<Imovel, "id">) {
    if (!form) return;

    const res = await fetch(`/api/imoveis/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const atualizado = await res.json();
    setImoveis((prev) =>
      prev.map((i) => (i.id === form.id ? atualizado : i))
    );

    setEditar(false);
    setForm(null);
  }

  /* ===== DELETE ===== */
  async function excluirImovel() {
    if (!form) return;

    await fetch(`/api/imoveis/${form.id}`, {
      method: "DELETE",
    });

    setImoveis((prev) => prev.filter((i) => i.id !== form.id));
    setConfirmarExcluir(false);
    setForm(null);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestão de Imóveis</CardTitle>
        <Button onClick={() => setAbrirNovo(true)}>
          <Plus className="w-4 h-4" />
          Novo imóvel
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Compra</TableHead>
              <TableHead>Mercado</TableHead>
              <TableHead>% Pool</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {imoveis.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium text-[#101820]">{i.nome}</TableCell>
                <TableCell>{i.localizacao}</TableCell>
                <TableCell className="max-w-[220px] truncate">{i.descricao}</TableCell>
                <TableCell>R$ {i.valorCompra.toLocaleString("pt-BR")}</TableCell>
                <TableCell>R$ {i.valorMercado.toLocaleString("pt-BR")}</TableCell>
                <TableCell>{i.percentualPool}%</TableCell>
                <TableCell>
                  <Badge variant={i.status === "inativo" ? "secondary" : "default"}>
                    {i.status ?? "ativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#6B7280] hover:text-[#101820]"
                    onClick={() => {
                      setForm(i);
                      setEditar(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#6B7280] hover:text-destructive"
                    onClick={() => {
                      setForm(i);
                      setConfirmarExcluir(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* MODAIS */}
      {abrirNovo && (
        <ModalImovel
          titulo="Novo Imóvel"
          onClose={() => setAbrirNovo(false)}
          onSave={criarImovel}
        />
      )}

      {editar && form && (
        <ModalImovel
          titulo="Editar Imóvel"
          initial={form}
          onClose={() => setEditar(false)}
          onSave={atualizarImovel}
        />
      )}

      {confirmarExcluir && (
        <ConfirmarExcluir
          onCancel={() => setConfirmarExcluir(false)}
          onConfirm={excluirImovel}
        />
      )}
    </Card>
  );
}

/* ================= MODAL IMÓVEL ================= */

function ModalImovel({
  titulo,
  initial,
  onClose,
  onSave,
}: {
  titulo: string;
  initial?: Imovel;
  onClose: () => void;
  onSave: (data: Omit<Imovel, "id">) => void;
}) {
  const [data, setData] = useState<Omit<Imovel, "id">>({
    nome: initial?.nome || "",
    slug: initial?.slug || "",
    localizacao: initial?.localizacao || "",
    descricao: initial?.descricao || "",
    valorCompra: initial?.valorCompra || 0,
    valorMercado: initial?.valorMercado || 0,
    percentualPool: initial?.percentualPool || 0,
    status: initial?.status || "ativo",
    imagemUrl: initial?.imagemUrl || "",
    imagens: initial?.imagens || [],
    roiProjetado: initial?.roiProjetado ?? null,
    roiRealizado: initial?.roiRealizado ?? null,
    dataAquisicao: toDateInputValue(initial?.dataAquisicao),
    statusDocumental: initial?.statusDocumental || "",
    documentos: initial?.documentos || {},
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Nome" value={data.nome} onChange={(v) => setData({ ...data, nome: v })} />
            <Campo label="Slug" value={data.slug || ""} onChange={(v) => setData({ ...data, slug: v })} />
          </div>

          <Campo label="Localização" value={data.localizacao} onChange={(v) => setData({ ...data, localizacao: v })} />

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea
              value={data.descricao}
              onChange={(e) => setData({ ...data, descricao: e.target.value })}
            />
          </div>

          <GaleriaEditor
            slug={data.slug || "imovel"}
            value={data.imagens || []}
            onChange={(v) => setData({ ...data, imagens: v })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CampoNumero
              label="Valor de Compra"
              value={data.valorCompra}
              onChange={(v) => setData({ ...data, valorCompra: v })}
            />

            <CampoNumero
              label="Valor de Mercado"
              value={data.valorMercado}
              onChange={(v) => setData({ ...data, valorMercado: v })}
            />

            <CampoNumero
              label="% Pool"
              value={data.percentualPool}
              onChange={(v) => setData({ ...data, percentualPool: v })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoNumero
              label="ROI Projetado (%)"
              value={data.roiProjetado ?? 0}
              onChange={(v) => setData({ ...data, roiProjetado: v })}
            />

            <CampoNumero
              label="ROI Realizado (%)"
              value={data.roiRealizado ?? 0}
              onChange={(v) => setData({ ...data, roiRealizado: v })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Data de Aquisição</Label>
              <Input
                type="date"
                value={data.dataAquisicao || ""}
                onChange={(e) => setData({ ...data, dataAquisicao: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={data.status || "ativo"}
                onChange={(e) => setData({ ...data, status: e.target.value })}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Select>
            </div>
          </div>

          <Campo
            label="Status Documental"
            value={data.statusDocumental || ""}
            onChange={(v) => setData({ ...data, statusDocumental: v })}
          />

          <DocumentosEditor
            slug={data.slug || "imovel"}
            value={data.documentos || {}}
            onChange={(v) => setData({ ...data, documentos: v })}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(data)}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ================= UPLOAD (compartilhado) ================= */

async function uploadArquivo(file: File, tipo: "foto" | "documento", slug: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo", tipo);
  formData.append("slug", slug);

  const res = await fetch("/api/admin/upload-midia-imovel", {
    method: "POST",
    body: formData,
  });
  const json = await res.json();

  if (!json.ok) throw new Error(json.error || "Erro ao enviar arquivo");
  return json as { ok: true; url: string; nome: string };
}

/* ================= GALERIA DE FOTOS ================= */

function GaleriaEditor({
  slug,
  value,
  onChange,
}: {
  slug: string;
  value: ImagemItem[];
  onChange: (v: ImagemItem[]) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setEnviando(true);
    setErro("");
    try {
      const { url } = await uploadArquivo(file, "foto", slug);
      onChange([...value, { url }]);
    } catch (err: any) {
      setErro(err.message || "Erro ao enviar foto");
    }
    setEnviando(false);
  }

  function remover(idx: number) {
    const novo = [...value];
    novo.splice(idx, 1);
    onChange(novo);
  }

  return (
    <div className="space-y-1.5">
      <Label>Fotos {value.length > 0 && <span className="text-[#9CA3AF] font-normal">(a primeira é a capa)</span>}</Label>

      {erro && <p className="text-xs text-destructive">{erro}</p>}

      <div className="flex flex-wrap gap-2">
        {value.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E7EB] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            {idx === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">Capa</span>
            )}
            <button
              type="button"
              onClick={() => remover(idx)}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <label className="w-20 h-20 rounded-lg border border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#CBA35C] transition-colors text-[#9CA3AF] hover:text-[#CBA35C]">
          <Plus className="w-4 h-4" />
          <span className="text-[9px] font-semibold">{enviando ? "Enviando..." : "Adicionar"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={enviando} />
        </label>
      </div>
    </div>
  );
}

/* ================= DOCUMENTOS ================= */

function DocumentosEditor({
  slug,
  value,
  onChange,
}: {
  slug: string;
  value: Documentos;
  onChange: (v: Documentos) => void;
}) {
  const [enviandoCat, setEnviandoCat] = useState<string | null>(null);

  function addItem(cat: keyof Documentos) {
    const items = value[cat] || [];
    onChange({ ...value, [cat]: [...items, { nome: "", url: "" }] });
  }

  function updateItem(cat: keyof Documentos, idx: number, campo: keyof DocumentoItem, valor: string) {
    const items = [...(value[cat] || [])];
    items[idx] = { ...items[idx], [campo]: valor };
    onChange({ ...value, [cat]: items });
  }

  function removeItem(cat: keyof Documentos, idx: number) {
    const items = [...(value[cat] || [])];
    items.splice(idx, 1);
    onChange({ ...value, [cat]: items });
  }

  async function handleUpload(cat: keyof Documentos, idx: number, file: File) {
    setEnviandoCat(`${cat}-${idx}`);
    try {
      const { url, nome } = await uploadArquivo(file, "documento", slug);
      const items = [...(value[cat] || [])];
      items[idx] = { nome: items[idx]?.nome || nome, url };
      onChange({ ...value, [cat]: items });
    } catch (err: any) {
      alert(err.message || "Erro ao enviar documento");
    }
    setEnviandoCat(null);
  }

  return (
    <div className="space-y-1.5">
      <Label>Documentos</Label>

      <div className="space-y-2">
        {CATEGORIAS_DOCUMENTOS.map(({ key, label }) => (
          <div key={key} className="rounded-xl border border-[#E5E7EB] p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#101820]">{label}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => addItem(key)}>
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </Button>
            </div>

            {(value[key] || []).map((item, idx) => (
              <div key={idx} className="flex gap-2 mt-2">
                <Input
                  placeholder="Nome"
                  value={item.nome}
                  onChange={(e) => updateItem(key, idx, "nome", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="URL (ou envie um arquivo →)"
                  value={item.url}
                  onChange={(e) => updateItem(key, idx, "url", e.target.value)}
                  className="flex-[2]"
                />
                <label className="shrink-0">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>{enviandoCat === `${key}-${idx}` ? "Enviando..." : "Upload"}</span>
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    disabled={enviandoCat === `${key}-${idx}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) handleUpload(key, idx, file);
                    }}
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-[#6B7280] hover:text-destructive shrink-0"
                  onClick={() => removeItem(key, idx)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= CONFIRM DELETE ================= */

function ConfirmarExcluir({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir este imóvel?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ================= CAMPOS ================= */

function Campo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function CampoNumero({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
