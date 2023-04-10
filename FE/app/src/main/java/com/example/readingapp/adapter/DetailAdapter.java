package com.example.readingapp.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.readingapp.R;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.model.Chapter;
import com.example.readingapp.model.Truyen;

import java.text.SimpleDateFormat;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DetailAdapter extends RecyclerView.Adapter<DetailAdapter.ViewHolder> {
    private final List<Chapter> listChapter;
    private Context context;
    private static final String MY_PREFERENCE_NAME = "USER_ID";

    public DetailAdapter(List<Chapter> listChapter, Context context) {
        this.listChapter = listChapter;
        this.context = context;
    }

    @NonNull
    @Override
    public DetailAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_detail_chapter, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DetailAdapter.ViewHolder holder, int position) {
        Chapter chapter = listChapter.get(position);
        if (chapter == null) {
            return;
        }
        holder.tv_chapter.setText(chapter.getTenChapter());
        holder.txtnoidungtruyen.setText(chapter.getNoiDung());
        @SuppressLint("SimpleDateFormat") SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
        holder.txtngaycapnhat.setText("Ngày cập nhật: " + simpleDateFormat.format(chapter.getNgayNhap()));
        String luotxem = String.valueOf(chapter.getLuotXem());
        holder.txtluotxem.setText("Lượt xem: " + luotxem);
        Chapter updateChap = new Chapter((chapter.getLuotXem() + 1), true);
        ApiService.apiService.UpdateChapter(chapter.get_id(), updateChap).enqueue(new Callback<Chapter>() {
            @Override
            public void onResponse(@NonNull Call<Chapter> call, @NonNull Response<Chapter> response) {
            }

            @Override
            public void onFailure(@NonNull Call<Chapter> call, @NonNull Throwable t) {
            }
        });
        UpdateLuotXemTruyen(chapter.getTruyen());
        SharedPreferences sharedPreferences = holder.itemView.getContext().getSharedPreferences(MY_PREFERENCE_NAME, holder.itemView.getContext().MODE_PRIVATE);
        String id = sharedPreferences.getString("value", "");
    }

    private void UpdateLuotXemTruyen(String truyen) {
        ApiService.apiService.GetTruyen(truyen).enqueue(new Callback<Truyen>() {
            @Override
            public void onResponse(Call<Truyen> call, Response<Truyen> response) {
                Truyen truyen1 = response.body();
                if (truyen1 != null) {
                    Truyen truyen2 = new Truyen(truyen1.isTrangThai(), truyen1.isTinhTrang(), truyen1.getLuotThich(), (truyen1.getLuotXem() + 1));
                    ApiService.apiService.UpdateTruyen(truyen1.get_id(), truyen2).enqueue(new Callback<Truyen>() {
                        @Override
                        public void onResponse(@NonNull Call<Truyen> call, @NonNull Response<Truyen> response) {

                        }

                        @Override
                        public void onFailure(@NonNull Call<Truyen> call, @NonNull Throwable t) {

                        }
                    });
                }
            }

            @Override
            public void onFailure(Call<Truyen> call, Throwable t) {

            }
        });
    }

    @Override
    public int getItemCount() {
        if (listChapter != null) {
            return listChapter.size();
        }
        return 0;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        private final TextView tv_chapter, txtnoidungtruyen, txtngaycapnhat, txtluotxem;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tv_chapter = itemView.findViewById(R.id.tv_chapter);
            txtnoidungtruyen = itemView.findViewById(R.id.txtnoidungtruyen);
            txtngaycapnhat = itemView.findViewById(R.id.txtngaycapnhat);
            txtluotxem = itemView.findViewById(R.id.txtluotxem);
        }
    }
}
