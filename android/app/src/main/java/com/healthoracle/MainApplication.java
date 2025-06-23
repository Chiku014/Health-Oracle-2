import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;

@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new RNDateTimePickerPackage());
    return packages;
} 