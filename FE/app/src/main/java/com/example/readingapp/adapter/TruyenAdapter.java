package com.example.readingapp.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.readingapp.R;
import com.example.readingapp.function.GetTruyen;
import com.example.readingapp.model.Truyen;

import java.util.ArrayList;
import java.util.List;

public class TruyenAdapter extends RecyclerView.Adapter<TruyenAdapter.TruyenTranhViewHolder> {
    private Context context;
    private List<Truyen> mListTruyenTranh;

    @SuppressLint("NotifyDataSetChanged")
    public TruyenAdapter(Context context, List<Truyen> mListTruyenTranh) {
        this.context = context;
        this.mListTruyenTranh = mListTruyenTranh;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public TruyenTranhViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_truyen, parent, false);
        return new TruyenTranhViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TruyenTranhViewHolder holder, int position) {
        Truyen truyen = mListTruyenTranh.get(position);
        if (truyen != null) {
            holder.tenTruyebTranh.setText(truyen.getTenTruyen());
            Glide.with(this.context).load(truyen.getAnhBia()).into(holder.imgAnhBia);
            holder.crvTruyen.setOnClickListener(v -> {
                //Click vào chi tiết truyện
                Intent intent = new Intent(context, GetTruyen.class);
                intent.putExtra("clickTruyen", truyen);
                context.startActivity(intent);
            });
        }
    }

    public void release() {
        context = null;
    }

    @Override
    public int getItemCount() {
        if (mListTruyenTranh != null)
            return mListTruyenTranh.size();
        return 0;
    }

    @SuppressLint("NotifyDataSetChanged")
    public void filterList(ArrayList<Truyen> filteredList) {
        mListTruyenTranh = filteredList;
        notifyDataSetChanged();
    }

    public static class TruyenTranhViewHolder extends RecyclerView.ViewHolder {
        private final CardView crvTruyen;
        private final TextView tenTruyebTranh;
        private final ImageView imgAnhBia;


        public TruyenTranhViewHolder(@NonNull View itemView) {
            super(itemView);
            crvTruyen = itemView.findViewById(R.id.crv_TruyenTranh);
            tenTruyebTranh = itemView.findViewById(R.id.tv_TenTruyen);
            imgAnhBia = itemView.findViewById(R.id.imgv_AnhBia);
        }
    }
}

