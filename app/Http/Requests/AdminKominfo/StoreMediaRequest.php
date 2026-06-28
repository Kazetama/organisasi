<?php

namespace App\Http\Requests\AdminKominfo;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['required', 'file', 'mimes:jpeg,jpg,png,gif,webp,svg', 'max:10240'],
            'alt' => ['nullable', 'string', 'max:255'],
        ];
    }
}
