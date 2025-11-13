<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Form extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', // form name/title
        'structure', 
    ];

    // Relationship to form fields
    public function fields()
    {
        return $this->hasMany(FormField::class);
    }
}
