package com.example.readingapp.ui;

import static android.content.Context.MODE_PRIVATE;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.readingapp.R;
import com.example.readingapp.adapter.TruyenAdapter;
import com.example.readingapp.api.ApiService;
import com.example.readingapp.model.Truyen;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TrangChuFragment extends Fragment {
    Toolbar toolbar;
    private static final String MY_PREFERENCE_NAME = "USER_ID";
    BottomNavigationView bottomNavigationView;
    RecyclerView rcvDSTruyenHot, rcvDSTruyenMoi;
    TruyenAdapter truyenTranhHotAdapter, truyenTranhMoiAdapter, truyenAdapter;
    List<Truyen> listTruyenMoi, listTruyenHot;
    ImageView imgSearch, imgPhanLoai;
    String id;
    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view;
        view = inflater.inflate(R.layout.fragment_trang_chu, container, false);
        init(view);
        toolBar();
        //GetTatCaTruyen();
        GetTruyenHot();
        GetTruyenMoi();
        initGridView();
        SharedPreferences sharedPreferences = this.getActivity().getSharedPreferences(MY_PREFERENCE_NAME, MODE_PRIVATE);
        id = sharedPreferences.getString("value", "");
        return view;
    }

    //Khởi tạo
    private void initGridView() {
        listTruyenHot = new ArrayList<>();
        listTruyenMoi = new ArrayList<>();
        GridLayoutManager gridLayoutManager = new GridLayoutManager(getActivity(), 3);
        rcvDSTruyenMoi.setLayoutManager(gridLayoutManager);
        rcvDSTruyenMoi.setNestedScrollingEnabled(false);
        rcvDSTruyenMoi.setFocusable(false);
        GridLayoutManager gridLayoutManager2 = new GridLayoutManager(getActivity(), 3);
        rcvDSTruyenHot.setLayoutManager(gridLayoutManager2);
        rcvDSTruyenHot.setNestedScrollingEnabled(false);
        rcvDSTruyenHot.setFocusable(false);
    }

    private void GetTruyenHot() {
        ApiService.apiService.GetTatCaTruyen().enqueue(new Callback<List<Truyen>>() {
            @Override
            public void onResponse(@NonNull Call<List<Truyen>> call, @NonNull Response<List<Truyen>> response) {
                listTruyenHot = response.body();
                List<Truyen> list = new ArrayList<>();
                if (listTruyenHot != null) {
                    for (int i = 0; i < listTruyenHot.size(); i++) {
                        if (listTruyenHot.get(i).isTrangThai()) {
                            list.add(listTruyenHot.get(i));
                        }
                    }
                    truyenTranhHotAdapter = new TruyenAdapter(getContext(), list);
                    rcvDSTruyenHot.setAdapter(truyenTranhHotAdapter);
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Truyen>> call, @NonNull Throwable t) {
            }
        });
    }

    private void GetTruyenMoi() {
        ApiService.apiService.GetTruyenMoi().enqueue(new Callback<List<Truyen>>() {
            @Override
            public void onResponse(@NonNull Call<List<Truyen>> call, @NonNull Response<List<Truyen>> response) {
                listTruyenMoi = response.body();
                List<Truyen> list = new ArrayList<>();
                if (listTruyenMoi != null) {
                    for (int i = 0; i < listTruyenMoi.size(); i++) {
                        if (listTruyenMoi.get(i).isTrangThai()) {
                            list.add(listTruyenMoi.get(i));
                        }
                    }
                    truyenTranhMoiAdapter = new TruyenAdapter(getContext(), list);
                    rcvDSTruyenMoi.setAdapter(truyenTranhMoiAdapter);
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Truyen>> call, @NonNull Throwable t) {
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (truyenAdapter != null)
            truyenAdapter.release();
    }

    private void init(View view) {
        toolbar = view.findViewById(R.id.toolbar_trangchu);
        rcvDSTruyenMoi = view.findViewById(R.id.rcv_DSTruyenMoi);
        rcvDSTruyenHot = view.findViewById(R.id.rcv_DSTruyenHot);
    }

    //ToolBar
    private void toolBar() {
        AppCompatActivity activity = (AppCompatActivity) getActivity();
        activity.setSupportActionBar(toolbar);
        activity.getSupportActionBar().setTitle("Đề xuất");
        toolbar.setOverflowIcon(ContextCompat.getDrawable(activity, R.drawable.baseline_search_24));
    }

    //search function
    @Override
    public void onCreateOptionsMenu(@NonNull Menu menu, @NonNull MenuInflater inflater) {
        inflater.inflate(R.menu.menu_trangchu, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.menu_search: {
                Intent intent = new Intent(getActivity(), SearchActivity.class);
                startActivity(intent);
                return true;
            }
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
